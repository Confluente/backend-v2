import {Request, Response, Router} from "express";
const express: any = require("express");

const Q: any = require("q");
const marked: any = require("marked");
const sequelize: any = require("sequelize");
const multer: any = require("multer");
const mime: any = require('mime-types');
const fs: any = require('fs');

import {Group} from "../models/group";
import {User} from "../models/user";
import {Activity} from "../models/activity";

const permissions: any = require("../permissions");

import {destringifyStringifiedArrayOfStrings, stringifyArrayOfStrings} from "../helpers/arrayHelper";

const router: Router = express.Router();

const Op: any = sequelize.Op;

// path where the pictures of the activities are put in in frontend
const pathToPictures: string = '../Frontend-Angular/src/assets/img/activities/';

// Set The Storage Engine
const storage: any = multer.diskStorage({
    destination: pathToPictures,
    filename(req: Request, file: any, cb: any): void {
        cb(null, req.params.id + "." + mime.extension(file.mimetype));
    }
});

// Init Upload
const upload = multer({
    storage,
    limits: {fileSize: 1000000}, // 1 MB
    fileFilter(req: Express.Request, file: File, cb: any): void {
        checkFileType(file, cb);
    }
}).single("image");

// Check File Type
function checkFileType(file: any, cb: any): any {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Deletes a picture of an activity given an id
function deletePicture(id: number): void {
    const files = fs.readdirSync(pathToPictures);
    for (const file of files) {
        if (file.split(".")[0].toString() === id.toString()) {
            fs.unlinkSync(pathToPictures + file);
            break;
        }
    }
}

// This route is for handling general operations for activities. Namely, getting all activities and creating a
// new activity.
router.route("/")
    /**
     * Gets every activity in the database happening from today onwards
     */
    .get(function(req: Request, res: Response, next: any): any {
        // Get all activities from the database
        Activity.findAll({
            attributes: ["id", "name", "description", "location", "date", "startTime", "endTime", "published", "subscriptionDeadline", "canSubscribe", "hasCoverImage"],
            order: [
                ["date", "ASC"]
            ],
            where: {
                date: {[
                        Op.between]: [new Date().setDate(new Date().getDate() - 1),
                        new Date().setFullYear(new Date().getFullYear() + 10)
                    ]}
            },
            include: [{
                model: Group,
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }, {
                model: User,
                as: "participants",
                attributes: ["id", "displayName", "firstName", "lastName", "email"]
            }]
        }).then(function(foundActivities: Activity[]): any {
            // Check for every activity if the client can view them
            const promises = foundActivities.map(function(singleActivity: Activity): any {
                // If the activity is published, everyone (also not logged in) is allowed to see them
                // These lines are needed not to crash the management table in some cases
                if (singleActivity.published) { return Q(singleActivity); }

                // If not logged in (and unpublished), client has no permission
                if (!res.locals.session) { return Q(null); }

                // If logged in (and unpublished), check whether client has permission to view activity
                return permissions.check(res.locals.session.user, {
                    type: "ACTIVITY_VIEW",
                    value: singleActivity.id
                }).then(function(result: boolean): Activity {
                    // If no permission, return null, otherwise return activity
                    return result ? singleActivity : null;
                });
            });

            Q.all(promises).then(function(promisedActivities: Activity[]): any {
                // Filter out all null events
                promisedActivities = promisedActivities.filter(function(singleActivity: Activity): boolean {
                    return singleActivity !== null;
                });

                // For each activity in activities, enable markdown for description
                promisedActivities = promisedActivities.map(function(singleActivity: Activity): Activity {
                    singleActivity.dataValues.description_html = marked(singleActivity.description || "");
                    return singleActivity;
                });

                // Send activities to the client
                res.send(promisedActivities);
            }).done();
        });
    })

    /**
     * Creates a new activity.
     */
    .post(function(req: Request, res: Response, next: any): any {
        // Check whether the client is logged in
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // Store activity in variable
        const activity = req.body;

        // Check if mandatory fields are filled in
        if (!activity.organizer || !activity.description || !activity.date || isNaN(Date.parse(activity.date))) {
            return res.sendStatus(400);
        }

        // Check whether the client has permission to organize events
        permissions.check(res.locals.session.user, {
            type: "GROUP_ORGANIZE",
            value: activity.organizer
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Format form correctly
            // Change all lists database strings
            if (activity.canSubscribe) {
                // transform lists to strings
                activity.typeOfQuestion = stringifyArrayOfStrings(activity.typeOfQuestion);
                activity.questionDescriptions = stringifyArrayOfStrings(activity.questionDescriptions);
                activity.formOptions = stringifyArrayOfStrings(activity.options);
                activity.required = stringifyArrayOfStrings(activity.required);
                activity.privacyOfQuestions = stringifyArrayOfStrings(activity.privacyOfQuestions);
            }

            // Set organizerId
            activity.OrganizerId = activity.organizer;

            // Create activity in database
            return Activity.create(activity).then(function(createdActivity: Activity): void {
                // Send new activity back to the client
                res.status(201).send(createdActivity);
            }).catch(function(err: Error): void {
                console.error(err);
            });
        }).done();
    });

// This route is for handling pictures on activities.
router.route("/pictures/:id")
    /**
     * Checks permissions for handling pictures for activity
     */
    .all(function(req: Request, res: Response, next: any): any {
        // check for people to be logged in
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // Check permissions
        return permissions.check(res.locals.session.user, {
            type: "ACTIVITY_EDIT",
            value: req.params.id
        }).then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            next();
        });
    })

    /**
     * Uploads a picture
     */
    .post(function(req: Request, res: Response, next: any): void {
        upload(req, res, function(result: any): void {
            res.send();
        });
    })

    /**
     * Edits a picture
     */
    .put(function(req: Request, res: Response, next: any): void {
        // delete old picture
        // TODO check if this casting works
        deletePicture((req.params.id as unknown as number));

        upload(req, res, function(result: any): void {
            res.send({Successful: true});
        });
    });

// This route is for getting the activities for the manage page
// For the manage page, you should only get the activities which you are allowed to edit
router.route("/manage")
    /*
     * Gets all activities for the manage page.
     * @return List of activities that the client is allowed to edit
     */
    .get(function(req: Request, res: Response, next: any): any {
        // Get all activities from the database
        Activity.findAll({
            attributes: ["id", "name", "description", "location", "date", "startTime", "endTime", "published", "subscriptionDeadline"],
            order: [
                ["date", "ASC"]
            ],
            include: [{
                model: Group,
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then(function(foundActivities: Activity[]): void {
            // For every activity, check if the client is allowed to edit it
            const promises = foundActivities.map(function(singleActivity: Activity): any {
                return permissions.check(res.locals.session.user, {
                    type: "ACTIVITY_EDIT",
                    value: singleActivity.id
                }).then(function(result: boolean): Activity {
                    return result ? singleActivity : null;
                });
            });

            Q.all(promises).then(function(promisedActivities: Activity[]): void {
                // Filter all activities out that are null due to limited permission
                promisedActivities = promisedActivities.filter(function(singleActivity: Activity): boolean {
                    return singleActivity !== null;
                });

                // For each activity in activities, enable markdown for description
                promisedActivities = promisedActivities.map(function(singleActivity: Activity): Activity {
                    singleActivity.dataValues.description_html = marked(singleActivity.description || "");
                    return singleActivity;
                });

                // Send activities to the client
                res.send(promisedActivities);
            }).done();
        });
    });

// This route is for handling subscriptions on activities.
router.route("/subscriptions/:id")
    /*
     * Adds a subscription to a specific activity
     */
    .post(function(req: Request, res: Response, next: any): any {
        // check if client is logged in
        const userId: number = res.locals.session ? res.locals.session.user : null;

        // If client is not logged in, send 403
        if (userId == null) { return res.status(403).send({status: "Not logged in"}); }

        // Get activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: Group,
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then(function(foundActivity: Activity): any {
            // format answer string
            const answerString = stringifyArrayOfStrings(req.body);

            // add relation
            return User.findByPk(userId).then(function(foundUser: User): void {
                foundUser.addActivity(foundActivity, {through: {answers: answerString}})
                    .then(function(result: Activity): any {

                    // Send relation back to the client
                    res.send(result);
                });
            });
        });
    })

    /**
     * Deletes a subscription from an activity
     */
    .delete(function(req: Request, res: Response): any {
        // checking if client is logged in
        const userId: number = res.locals.session ? res.locals.session.user : null;

        // If client is not logged in, send 403
        if (userId == null) { return res.status(403).send({status: "Not logged in"}); }

        // Get activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: User,
                as: "participants"
            }]
        }).then(function(foundActivity: Activity): any {
            // looping through all subscriptions to find the one of the user that requested the delete
            for (const participant of foundActivity.dataValues.participants) {
                if (participant.dataValues.id === userId) {
                    participant.dataValues.subscription.destroy();
                }
            }

            // Send confirmation to client
            return res.send(200);
        }).done();
    });

// This route is for handling activity specific operations such as getting an activity, editing an activity and
// removing an activity.
router.route("/:id")
    /**
     * Gets activity with id from database and stores it in res.locals.activity
     */
    .all(function(req: Request, res: Response, next: any): void {
        // Getting specific activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: Group,
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }, {
                model: User,
                as: "participants",
                attributes: ["id", "displayName", "firstName", "lastName", "email"]
            }]
        }).then(function(foundActivity: Activity): any {
            // If activity not found, send 404
            if (foundActivity === null) {
                res.status(404).send({status: "Not Found"});
            } else {
                // Store activity
                res.locals.activity = foundActivity;

                next();
            }
        }).done();
    })

    /**
     * Sends specific activity to the client
     */
    .get(function(req: Request, res: Response): any {
        // Check if client is logged in
        const user = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to view the activity
        permissions.check(user, {type: "ACTIVITY_VIEW", value: req.params.id}).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Store activity in variable
            const activity = res.locals.activity;

            // Enable markdown
            activity.dataValues.description_html = marked(activity.description);

            // formatting activity correctly for frontend
            if (activity.canSubscribe) {
                // split strings into lists
                activity.participants.forEach(function(participant: any): void {
                    participant.subscription.answers =
                        destringifyStringifiedArrayOfStrings(participant.subscription.answers);
                });

                activity.typeOfQuestion = destringifyStringifiedArrayOfStrings(activity.typeOfQuestion);
                activity.questionDescriptions = destringifyStringifiedArrayOfStrings(activity.questionDescriptions);
                activity.formOptions = destringifyStringifiedArrayOfStrings(activity.formOptions);
                activity.required = destringifyStringifiedArrayOfStrings(activity.required);
                activity.privacyOfQuestions = destringifyStringifiedArrayOfStrings(activity.privacyOfQuestions);
                const newOptions: string[][] = [];
                activity.formOptions.forEach(function(question: string): void {
                    newOptions.push(question.split('#;#'));
                });

                activity.formOptions = newOptions;
            }

            // Send activity to client
            if (activity.hasCoverImage) {
                const files = fs.readdirSync(pathToPictures);
                for (const file of files) {
                    if (file.split(".")[0].toString() === activity.id.toString()) {
                        activity.dataValues.coverImage = file;
                    }
                }
            }

            res.send(activity);
        }).done();
    })

    /**
     * Edits a specific activity
     */
    .put(function(req: Request, res: Response): void {
        // Check if client is logged in
        const userId: number = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to edit the activity
        permissions.check(userId, {
            type: "ACTIVITY_EDIT",
            value: res.locals.activity.id
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Get the organizing group from the database
            Group.findOne({where: {fullName: req.body.organizer}}).then(function(foundGroup: Group): any {
                req.body.OrganizerId = foundGroup.id;
                req.body.Organizer = foundGroup;

                // Update the activity in the database
                if (req.body.canSubscribe) {
                    // formatting the subscription form into strings for the database
                    req.body.typeOfQuestion = stringifyArrayOfStrings(req.body.typeOfQuestion);
                    req.body.questionDescriptions = stringifyArrayOfStrings(req.body.questionDescriptions);
                    req.body.formOptions = stringifyArrayOfStrings(req.body.formOptions);
                    req.body.required = stringifyArrayOfStrings(req.body.required);
                    req.body.privacyOfQuestions = stringifyArrayOfStrings(req.body.privacyOfQuestions);
                }

                return res.locals.activity.update(req.body).then(function(updatedActivity: Activity): void {
                    res.send(updatedActivity);
                }, function(err: Error): void {
                    console.error(err);
                });
            });
        }).done();
    })

    /*
     * Deletes a specific activity
     */
    .delete(function(req: Request, res: Response): void {
        // Check if the client is logged in
        const user = res.locals.session ? res.locals.session.user : null;

        // Check if the client has permission to edit the activity
        permissions.check(user, {
            type: "ACTIVITY_EDIT",
            value: res.locals.activity.id
        }).then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            // Delete cover image
            if (res.locals.activity.hasCoverImage) {
                deletePicture(res.locals.activity.id);
            }

            // Delete activity from database
            return res.locals.activity.destroy();
        }).then(function(): void {
            res.status(204).send({status: "Successful"});
        });
    });

module.exports = router;

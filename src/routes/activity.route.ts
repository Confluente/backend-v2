import express, {NextFunction, Request, Response, Router} from "express";

import Q from 'q';
import marked from 'marked';
import multer, {diskStorage, FileFilterCallback} from 'multer';
import mime from 'mime-types';
import fs from 'fs';

import {Group} from "../models/database/group.model";
import {User} from "../models/database/user.model";
import {Activity} from "../models/database/activity.model";

import {checkPermission} from "../permissions";

import {stringifyArrayOfStrings} from "../helpers/array.helper";

const router: Router = express.Router();

import {Op, where} from 'sequelize';
import {ActivityWeb} from "../models/web/activity.web.model";

// path where the pictures of the activities are put in in frontend
let pathToPictures: string = '';
if (process.env.NODE_ENV === "production") {
    pathToPictures = 'dist/frontend/assets/img/activities/';
} else {
    // This is the standard (development or test mode)
    pathToPictures = '../Frontend-Angular/src/assets/img/activities/';
}

// Set The Storage Engine
const storage: any = diskStorage({
    destination: pathToPictures,
    filename(req: Request, file: any, cb: any): void {
        cb(null, req.params.id + "." + mime.extension(file.mimetype));
    }
});

// Init Upload
const upload = multer({
    storage,
    limits: {fileSize: 1000000}, // 1 MB
    fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
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
    .get((req: Request, res: Response) => {
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
            include: [
                {model: Group, attributes: ["id", "displayName", "fullName", "email"]},
                {model: User, attributes: ["id", "displayName", "firstName", "lastName", "email"]}
            ]
        }).then(async function(foundActivities: Activity[]): Promise<any> {
            const activities = await ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities);

            // Check for every activity if the client can view them
            const promises = activities.map(function(singleActivity: ActivityWeb): any {
                // If the activity is published, everyone (also not logged in) is allowed to see them
                // These lines are needed not to crash the management table in some cases
                if (singleActivity.published) { return Q(singleActivity); }

                // If not logged in (and unpublished), client has no permission
                if (!res.locals.session) { return Q(null); }

                // If logged in (and unpublished), check whether client has permission to view activity
                return checkPermission(res.locals.session.user, {
                    type: "ACTIVITY_VIEW",
                    value: +singleActivity.id
                }).then(function(result: boolean): ActivityWeb {
                    // If no permission, return null, otherwise return activity
                    return result ? singleActivity : null;
                });
            });

            Q.all(promises).then(function(promisedActivities: Activity[]): any {
                // Filter out all null events
                promisedActivities = promisedActivities.filter(function(singleActivity: Activity): boolean {
                    return singleActivity !== null;
                });

                // Send activities to the client
                res.send(promisedActivities);
            }).done();
        });
    })

    /**
     * Creates a new activity.
     */
    .post((req: Request, res: Response) => {
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
        checkPermission(res.locals.session.user, {
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
        });
    });

// This route is for handling pictures on activities.
router.route("/pictures/:id")
    /**
     * Checks permissions for handling pictures for activity
     */
    .all((req: Request, res: Response, next: any) => {
        // check for people to be logged in
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // Check permissions
        return checkPermission(res.locals.session.user, {
            type: "ACTIVITY_EDIT",
            value: +req.params.id
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
    .post((req: Request, res: Response) => {
        upload(req, res, function(result: any): void {
            res.send();
        });
    })

    /**
     * Edits a picture
     */
    .put((req: Request, res: Response) => {
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
    .get((req: Request, res: Response) => {
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
        }).then(async function(foundActivities: Activity[]): Promise<void> {

            // Transform all db activities into web activities
            const activities: ActivityWeb[] = await ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities);

            // For every activity, check if the client is allowed to edit it
            const promises = activities.map(function(singleActivity: ActivityWeb): any {
                return checkPermission(res.locals.session.user, {
                    type: "ACTIVITY_EDIT",
                    value: +singleActivity.id
                }).then(function(result: boolean): ActivityWeb {
                    return result ? singleActivity : null;
                });
            });

            Q.all(promises).then(function(promisedActivities: Activity[]): void {
                // Filter all activities out that are null due to limited permission
                promisedActivities = promisedActivities.filter(function(singleActivity: Activity): boolean {
                    return singleActivity !== null;
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
    .post((req: Request, res: Response) => {
        // check if client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

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
                foundUser.$add('activity', foundActivity, {through: {answers: answerString}})
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
    .delete((req: Request, res: Response) => {
        // checking if client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

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
            for (const participant of foundActivity.participants) {
                if (participant.id === userId) {
                    // TODO check if this works?
                    participant.$remove('activity', foundActivity);
                }
            }

            // Send confirmation to client
            return res.send(200);
        });
    });

// This route is for handling activity specific operations such as getting an activity, editing an activity and
// removing an activity.
router.route("/:id")
    /**
     * Gets activity with id from database and stores it in res.locals.activity
     */
    .all((req: Request, res: Response, next: NextFunction) => {
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
        });
    })

    /**
     * Sends specific activity to the client
     */
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to view the activity
        checkPermission(user, {type: "ACTIVITY_VIEW", value: +req.params.id}).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Store activity in variable
            const activity = ActivityWeb.getWebModelFromDbModel(res.locals.activity);

            res.send(activity);
        });
    })

    /**
     * Edits a specific activity
     */
    .put((req: Request, res: Response) => {
        // Check if client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to edit the activity
        checkPermission(userId, {
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
        });
    })

    /*
     * Deletes a specific activity
     */
    .delete((req: Request, res: Response) => {
        // Check if the client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        // Check if the client has permission to edit the activity
        checkPermission(user, {
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

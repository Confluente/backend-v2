import express, {NextFunction, Request, Response, Router} from "express";
import multer, {diskStorage, FileFilterCallback} from 'multer';
import mime from 'mime-types';
import fs from 'fs';

import {Group} from "../models/database/group.model";
import {User} from "../models/database/user.model";
import {Activity} from "../models/database/activity.model";
import {ActivityWeb} from "../models/web/activity.web.model";

import {checkPermission} from "../permissions";
import {destringifyStringifiedArrayOfStrings, stringifyArrayOfStrings} from "../helpers/array.helper";
import {Op} from 'sequelize';
import {logger} from "../logger";

const router: Router = express.Router();


// path where the pictures of the activities are put in in frontend
let pathToPictures: string = '';
if (process.env.NODE_ENV === "production") {
    pathToPictures = 'dist/frontend/assets/img/activities/';
} else {
    // This is the standard (development or test mode)
    pathToPictures = '../Frontend-Angular/src/assets/img/activities/';
}


/**
 * Constant (helper) for interacting with file system.
 */
const storage: any = diskStorage({
    destination: pathToPictures,
    filename(req: Request, file: any, cb: any): void {
        cb(null, req.params.id + "." + mime.extension(file.mimetype));
    }
});


/**
 * Constant (helper) for uploading files using multer library.
 */
const upload = multer({
    storage,
    limits: {fileSize: 1000000}, // 1 MB
    fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
        checkFileType(file, cb);
    }
}).single("image");


/**
 * Function for checking file type.
 */
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

/**
 * Function to delete the picture of an activity given the ID of the activity.
 * @param id    ID of the activity.
 */
function deletePicture(id: number): void {
    // Get a list of the files.
    const files = fs.readdirSync(pathToPictures);

    // Loop over the files to check which one it is and unlink (delete) it.
    for (const file of files) {
        if (file.split(".")[0].toString() === id.toString()) {
            fs.unlinkSync(pathToPictures + file);
            break;
        }
    }
}


/**
 * This route is for handling general operations for activities. Namely, getting all activities and creating a
 * new activity.
 */
router.route("/")
    /**
     * Gets every activity in the database happening from today onwards.
     * Manage page activities getter has its own function.
     */
    .get((req: Request, res: Response) => {
        // Get all activities from the database
        Activity.findAll({
            attributes: ["id", "name", "description", "location", "date", "startTime", "endTime", "published", "subscriptionDeadline", "canSubscribe", "hasCoverImage"],
            order: [
                ["date", "ASC"]
            ],
            where: {
                date: {
                    [Op.between]: [new Date().setDate(new Date().getDate() - 1),
                        new Date().setFullYear(new Date().getFullYear() + 10)]
                }
            },
            include: [
                {
                    model: Group,
                    as: "organizer",
                    attributes: ["id", "displayName", "fullName", "email"]
                },
                {
                    model: User,
                    as: "participants",
                    attributes: ["id", "firstName", "lastName", "email"]
                }
            ]
        }).then((foundActivities: Activity[]) => {
            ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities)
                .then(async (activities: ActivityWeb[]) => {

                    // Makes an array of which activity is allowed to be viewed
                    // Has to be this way to work around the async of promises since filter does not work with that
                    const activitiesViewPermission = await Promise.all(
                        activities.map(async (activity: ActivityWeb) => {
                            // If the activity is published, everyone (also not logged in) is allowed to see them
                            // These lines are needed not to crash the management table in some cases
                            if (activity.published) {
                                return true;
                            }
    
                            // If not logged in (and unpublished), client has no permission
                            if (!res.locals.session) {
                                return false;
                            }
    
                            // If logged in (and unpublished), check whether client has permission to view activity
                            return await checkPermission(res.locals.session.userId, {
                                type: "ACTIVITY_VIEW",
                                value: +activity.id
                            });
                        })
                    );

                    activities = activities.filter((activity, index) => activitiesViewPermission[index]);
                    // Return the activities
                    return res.status(200).send(activities);

                }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Creates a new activity.
     *
     * Check activity model for required fields.
     */
    .post((req: Request, res: Response) => {
        // Check whether the client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Store activity in variable
        const activity = req.body;

        // Check if mandatory fields are filled in
        if (!activity.name || !activity.description || !activity.date || isNaN(Date.parse(activity.date))
            || !activity.organizerId) {
            return res.sendStatus(400);
        }

        if (activity.canSubscribe && (!activity.typeOfQuestion || !activity.questionDescriptions
            || !activity.options || !activity.required || !activity.privacyOfQuestions)) {
            console.log(activity);
            return res.sendStatus(400);
        }

        // Check whether the client has permission to organize events
        checkPermission(userId, {
            type: "GROUP_ORGANIZE",
            value: activity.organizerId
        }).then((result: boolean) => {
            // If no permission, send 403
            if (!result) {
                return res.sendStatus(403);
            }

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

            // Create activity in database
            Activity.create(activity).then((createdActivity: Activity) => {
                // Send new activity back to the client
                return res.status(201).send(createdActivity);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(400);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    });


/**
 * This route is for handling pictures of activities.
 */
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
        return checkPermission(res.locals.session.userId, {
            type: "ACTIVITY_EDIT",
            value: +req.params.id
        }).then((result: boolean) => {
            // Check if user has permission to edit activities.
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
        upload(req, res, () => {
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

        upload(req, res, () => {
            res.send({Successful: true});
        });
    });


/**
 * This route is for getting the activities for the manage page.
 * For the manage page, you should only get the activities which you are allowed to edit.
 */
router.route("/manage")
    /*
     * Gets all activities for the manage page.
     * @return List of activities that the client is allowed to edit
     */
    .get((req: Request, res: Response) => {
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // Get all activities from the database
        Activity.findAll({
            attributes: ["id", "name", "description", "location", "date", "startTime", "endTime", "published", "subscriptionDeadline"],
            order: [
                ["date", "ASC"]
            ],
            include: [{
                model: Group,
                as: "organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then((foundActivities: Activity[]) => {

            // Transform all db activities into web activities
            ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities)
                .then(async (activities: ActivityWeb[]) => {
                    async function filter(arr: any, callback: any): Promise<any> {
                        const fail = Symbol();
                        return (await Promise.all(arr.map(async (item: any) => (await callback(item)) ? item : fail)))
                            // tslint:disable-next-line:no-non-null-assertion
                            .filter(i => i !== fail);
                    }

                    // For every activity, check if the client is allowed to edit it
                    activities = await filter(activities, async (singleActivity: ActivityWeb) => {
                        return await checkPermission(res.locals.session.userId, {
                            type: "ACTIVITY_EDIT",
                            value: +singleActivity.id
                        });
                    });

                    // Return the filtered activities
                    return res.status(200).send(activities);
                }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    });


/**
 * This route is for handling subscriptions on activities.
 */
router.route("/subscriptions/:id")
    /*
     * Adds a subscription to a specific activity
     */
    .post((req: Request, res: Response) => {
        // check if client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // If client is not logged in, send 403
        if (userId == null) {
            return res.sendStatus(401);
        }

        // Get activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: Group,
                as: "organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then((foundActivity: Activity) => {

            if (foundActivity.numberOfQuestions !== req.body.length) {
                return res.status(400).send({
                    message: "The number of submitted answers does not" +
                        " correspond the number of questions in the form."
                });
            }


            const required = destringifyStringifiedArrayOfStrings(foundActivity.required);
            for (let i = 0; i < foundActivity.numberOfQuestions; i++) {
                if (required[i] === "true" &&
                    (req.body[i] === null || req.body[i] === undefined || req.body[i] === "")) {
                    return res.status(400).send({
                        message: "At least one required question was " +
                            "not answered properly"
                    });
                }
            }

            // format answer string
            const answerString = stringifyArrayOfStrings(req.body);

            // add relation
            return User.findByPk(userId).then((foundUser: User) => {
                foundUser.$add('activity', foundActivity, {through: {answers: answerString}})
                    .then((result: Activity) => {

                        // Send relation back to the client
                        return res.status(200).send(result);
                    }).catch((err: Error) => {
                    logger.error(err);
                    return res.sendStatus(500);
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Deletes a subscription from an activity
     */
    .delete((req: Request, res: Response) => {
        // checking if client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // If client is not logged in, send 403
        if (userId == null) {
            return res.sendStatus(401);
        }

        // Get activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: User,
                as: "participants"
            }]
        }).then((foundActivity: Activity) => {
            // Filter correct user from all participants of event.
            const participant: User[] = foundActivity.participants.filter((user: User) => {
                return user.id === userId;
            });

            // Remove subscription of filtered participant.
            participant[0].$remove('activity', foundActivity).then(_ => {
                return res.sendStatus(201);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        });
    });


/**
 * This route is for handling activity specific operations such as getting an activity, editing an activity and
 * removing an activity.
 */
router.route("/:id")
    /**
     * Gets activity with id from database and stores it in res.locals.activity
     */
    .all((req: Request, res: Response, next: NextFunction) => {
        // Getting specific activity from database
        Activity.findByPk(req.params.id, {
            include: [{
                model: Group,
                as: "organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }, {
                model: User,
                as: "participants",
                attributes: ["id", "firstName", "lastName", "email"]
            }]
        }).then((foundActivity: Activity) => {
            // If activity not found, send 404
            if (foundActivity === null) {
                res.status(404).send({message: "Not Found"});
            } else {
                // Store activity
                res.locals.activity = foundActivity;

                next();
            }
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Sends specific activity to the client
     */
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const userId = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to view the activity
        checkPermission(userId, {type: "ACTIVITY_VIEW", value: +req.params.id}).then((result: boolean) => {

            // If no permission, send 403
            if (!result) {
                return res.sendStatus(403);
            }

            // Transform activity to activity web and send to frontend.
            ActivityWeb.getWebModelFromDbModel(res.locals.activity).then((activity: ActivityWeb) => {
                return res.status(200).send(activity);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
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
            value: +req.params.id
        }).then((result: boolean) => {
            // If no permission, send 403
            if (!result) {
                return res.sendStatus(403);
            }

            // formatting the subscription form into strings for the database
            if (req.body.typeOfQuestion) {req.body.typeOfQuestion = stringifyArrayOfStrings(req.body.typeOfQuestion); }
            if (req.body.questionDescriptions) {
                req.body.questionDescriptions = stringifyArrayOfStrings(req.body.questionDescriptions);
            }
            if (req.body.formOptions) {req.body.formOptions = stringifyArrayOfStrings(req.body.formOptions); }
            if (req.body.required) {req.body.required = stringifyArrayOfStrings(req.body.required); }
            if (req.body.privacyOfQuestions) {
                req.body.privacyOfQuestions = stringifyArrayOfStrings(req.body.privacyOfQuestions);
            }

            // Update activity in DB and return activity (as web activity) to frontend
            return res.locals.activity.update(req.body).then((updatedActivity: Activity) => {

                delete updatedActivity.participants;

                ActivityWeb.getWebModelFromDbModel(updatedActivity).then((act: ActivityWeb) => {
                    return res.status(200).send(act);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.sendStatus(500);
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        });
    })

    /**
     * Deletes a specific activity.
     */
    .delete((req: Request, res: Response) => {
        // Check if the client is logged in
        const userId = res.locals.session ? res.locals.session.userId : null;

        // Check if the client has permission to edit the activity
        checkPermission(userId, {
            type: "ACTIVITY_EDIT",
            value: res.locals.activity.id
        }).then((result: boolean) => {

            // If no permission, return
            if (!result) {
                return res.sendStatus(403);
            }

            // Delete cover image
            if (res.locals.activity.hasCoverImage) {
                deletePicture(res.locals.activity.id);
            }

            // Delete activity from database
            res.locals.activity.destroy().then(() => {
                return res.sendStatus(200);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        });
    });

module.exports = router;

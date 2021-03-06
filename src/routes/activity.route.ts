import express, {NextFunction, Request, Response, Router} from "express";
import multer, {diskStorage, FileFilterCallback} from 'multer';
import mime from 'mime-types';
import fs from 'fs';

import {Group} from "../models/database/group.model";
import {User} from "../models/database/user.model";
import {Activity} from "../models/database/activity.model";
import {ActivityWeb} from "../models/web/activity.web.model";

import {checkPermission} from "../permissions";
import {stringifyArrayOfStrings} from "../helpers/array.helper";
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
                {model: Group, attributes: ["id", "displayName", "fullName", "email"]},
                {model: User, attributes: ["id", "firstName", "lastName", "email"]}
            ]
        }).then((foundActivities: Activity[]) => {
            ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities)
                .then(async (activities: ActivityWeb[]) => {
                    activities = await activities.filter((activity: ActivityWeb) => {
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
                        return checkPermission(res.locals.session.userId, {
                            type: "ACTIVITY_VIEW",
                            value: +activity.id
                        }).then((permission: boolean) => {
                            // If no permission, return null, otherwise return activity
                            return permission;
                        });

                    });

                    // Return the activities
                    res.status(200).send(activities);

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
     * TODO change frontend. Only have to have organizerId, and not 'organizer' anymore.
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

        // Check whether the client has permission to organize events
        checkPermission(userId, {
            type: "GROUP_ORGANIZE",
            value: activity.organizer
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
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then((foundActivities: Activity[]) => {

            // Transform all db activities into web activities
            ActivityWeb.getArrayOfWebModelsFromArrayOfDbModels(foundActivities).then((activities: ActivityWeb[]) => {
                // For every activity, check if the client is allowed to edit it
                activities = activities.filter((singleActivity: ActivityWeb) => {
                    return checkPermission(res.locals.session.userId, {
                        type: "ACTIVITY_EDIT",
                        value: +singleActivity.id
                    }).then((result: boolean) => {
                        return result;
                    });
                });

                // Return the filtered activities
                return res.send(activities);
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
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }]
        }).then((foundActivity: Activity) => {
            // format answer string
            const answerString = stringifyArrayOfStrings(req.body);

            // add relation
            return User.findByPk(userId).then((foundUser: User) => {
                foundUser.$add('activity', foundActivity, {through: {answers: answerString}})
                    .then((result: Activity) => {

                        // Send relation back to the client
                        return res.send(result);
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
                as: "Organizer",
                attributes: ["id", "displayName", "fullName", "email"]
            }, {
                model: User,
                as: "participants",
                attributes: ["id", "displayName", "firstName", "lastName", "email"]
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
                return res.send(activity);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Edits a specific activity
     *
     * Needs an attribute 'organizerId' in the body of the request which stores the id of the database instance of
     * the group organizing the activity.
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

            // Update the activity in the database
            if (req.body.canSubscribe) {
                // formatting the subscription form into strings for the database
                req.body.typeOfQuestion = stringifyArrayOfStrings(req.body.typeOfQuestion);
                req.body.questionDescriptions = stringifyArrayOfStrings(req.body.questionDescriptions);
                req.body.formOptions = stringifyArrayOfStrings(req.body.formOptions);
                req.body.required = stringifyArrayOfStrings(req.body.required);
                req.body.privacyOfQuestions = stringifyArrayOfStrings(req.body.privacyOfQuestions);
            }

            // Update activity in DB and return activity (as web activity) to frontend
            return res.locals.activity.update(req.body).then((updatedActivity: Activity) => {
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
                res.status(201);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        });
    });

module.exports = router;

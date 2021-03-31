import express, {NextFunction, Request, Response, Router} from "express";

import {User} from "../models/database/user.model";
import {Group} from "../models/database/group.model";
import {Role} from "../models/database/role.model";

import {checkPermission} from "../permissions";
import {generateSalt, getPasswordHashSync} from "../helpers/auth.helper";
import {createTestAccount, createTransport} from "nodemailer";
import {UserWeb} from "../models/web/user.web.model";
import {logger} from "../logger";

const router: Router = express.Router();

const passwordSaltLength: number = 16;
const approvalStringLength: number = 24;

router.route("/")
    /**
     * Gets all users from the database
     */
    .get((req: Request, res: Response) => {
        // Check if the client is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check if the client has permission to manage users
        checkPermission(userId, {type: "USER_MANAGE"}).then((result: boolean) => {

            // If no permission, return 403
            if (!result) {
                return res.status(403).send({message: "You are not authorized to manage users."});
            }

            // If client has permission, find all users in database, including role
            User.findAll({
                attributes: ["id", "firstName", "lastName", "email"],
                include: [Role],
                order: [
                    ["id", "ASC"]
                ]
            }).then((foundUsers: User[]) => {

                // Transform dbUsers to webUsers
                UserWeb.getArrayOfWebModelsFromArrayOfDbModels(foundUsers).then((users: UserWeb[]) => {
                    // Send the users back to the client
                    return res.status(200).send(users);
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
     * Creates a new user in the database
     */
    .post((req: Request, res: Response) => {
        // Check if request has password
        if (!req.body.password || typeof req.body.password !== "string") {
            return res.status(400).send({message: "No correct password was included in the request."});
        }

        // Check if request has all necessary attributes
        if (!req.body.email || !req.body.firstName || !req.body.lastName) {
            return res.status(400).send({message: "Not all required attributes were send in the request."});
        }

        // generate approvingHash, passwordSalt and passwordHash
        req.body.approvingHash = generateSalt(approvalStringLength);
        req.body.passwordSalt = generateSalt(passwordSaltLength);
        req.body.passwordHash = getPasswordHashSync(req.body.password, req.body.passwordSalt);

        // Delete password permanently
        delete req.body.password;

        // Set role of default member
        Role.findOne({where: {name: 'Regular member'}}).then((role: Role) => {

            const user = {
                ...(req.body),
                roleId: role.id
            };

            // Create new user in database
            return User.create(user).then(function(createdUser: User): void {

                // Send approval email to email
                createTestAccount().then(() => {

                    // TODO test if this works?? Same as in expressServer
                    const transporter: any = createTransport({
                        service: 'gmail',
                        secure: true,
                        // Never fill this password in and add it to git! Only filled in locally or on the server!
                        auth: {
                            user: 'web@hsaconfluente.nl',
                            pass: 'P$nxzDM%N0OhzcEHDcB#'
                        }
                    });

                    const link: string = "https://www.hsaconfluente.nl/api/user/approve/" + req.body.approvingHash;

                    transporter.sendMail({
                        from: '"website" <web@hsaconfluente.nl>',
                        to: req.body.email,
                        subject: "Registration H.S.A. Confluente",
                        text: "Thank you for making an account on our website hsaconfluente.nl! \n To fully activate your account, please visit this link: https://www.hsaconfluente.nl/api/user/approve/" + req.body.approvingHash,
                        html: "<h3>&nbsp;</h3><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"padding: 10px 0 30px 0;\"><table style=\"border: 1px solid #cccccc; border-collapse: collapse;\" border=\"0\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\"><tbody><tr><td style=\"padding: 40px 30px 40px 30px;\" bgcolor=\"#ffffff\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color: #153643; font-family: Arial, sans-serif; font-size: 24px;\"><h3><strong>Hooray! Welcome to H.S.A. Confluente</strong></h3></td></tr><tr><td style=\"padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\">Thank you for signing up to the website of H.S.A. Confluente at <a href=\"http://www.hsaconfluente.nl\">www.hsaconfluente.nl</a>. To activate your account on our website, please click the  <a href='" + link + "'>here!</a></td></tr><tr><td><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td valign=\"top\" width=\"260\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr style=\"height: 140px;\"><td style=\"padding: 25px 0px 0px; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; height: 140px;\"><h4>Events</h4><p>Now that you have an account on the H.S.A. Confluente website, you can subscribe to all the wonderful events that H.S.A. Confluente is organizing. Want to see what activities are coming up? <a href=\"https://hsaconfluente.nl/activities\">Click here!</a></p></td></tr></tbody></table></td><td style=\"font-size: 0; line-height: 0;\" width=\"20\">&nbsp;</td><td valign=\"top\" width=\"260\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr style=\"height: 140px;\"><td style=\"padding: 25px 0px 0px; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; height: 140px;\"><h4>Want to learn more?</h4><p>Are you interested in what H.S.A. Confluente is or can offer you? Then go and take an extensive look at our <a href=\"https://hsaconfluente.nl/\">website</a>! You can find pictures of all previous boards as well as information about what committees we have at H.S.A. Confluente!.</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"padding: 30px 30px 30px 30px;\" bgcolor=\"#1689ad\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;\" width=\"75%\">Web Commttee H.S.A. Confluente, TU/e 2020</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>"
                    }).then((_: any) => {
                    });
                });
                res.status(201).send(createdUser);
            }).catch((err: Error) => {
                logger.error(err);
                return res.status(406).send("Account could not be created. " + err.message);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.status(500);
        });
    });

// Specific user route
router.route("/:id")
    /**
     * Gets the user and stores it in res.locals.user
     */
    .all((req: Request, res: Response, next: NextFunction) => {
        // Check if client has a session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check whether user has permission to see the information of the user requested
        checkPermission(userId, {type: "USER_VIEW", value: +req.params.id}).then(function(result: boolean): any {
            // If no permission, return 403
            if (!result) {
                return res.status(403).send({message: "You are not authorized to view the requested user"});
            }

            // Get user from database
            User.findByPk(req.params.id, {
                attributes: ["id", "firstName", "lastName", "major", "address", "track", "honorsGeneration", "honorsMembership", "campusCardNumber", "mobilePhoneNumber", "email", "consentWithPortraitRight"],
                include: [Role, Group],
            }).then((foundUser: User) => {
                // User must always be found. If user requested is not in the database, then the checkPermission will
                // throw an error.

                // Store user and go to next function
                res.locals.user = foundUser;

                next();
            });
        }).catch((err: Error) => {
            logger.error(err);
            if (err.message === "permissions.checkPermission: USER_VIEW permission was requested for non " +
                "existing user.") {
                return res.status(404).send({message: err.message});
            } else {
                return res.status(500);
            }
        });
    })

    /**
     * Get a specific user from the database and return to the client
     */
    .get((req: Request, res: Response) => {
        // Transform user to web user and return
        UserWeb.getWebModelFromDbModel(res.locals.user).then((webUser: UserWeb) => {
            return res.status(200).send(webUser);
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Edit a user.
     * To edit a user, the request body needs to be a list with two entries: [user attributes, group data]
     * The user attributes can include any attributes available in the user model.
     * The group data is a list, where each entry represents data of a group. i.e. group data = [group1, group2, etc]
     *      each group must have
     *          {
     *              id: number         // the id of the group
     *              role: string       // the role this user fulfills in the group
     *          }
     */
    .put((req: Request, res: Response) => {

        if (!Array.isArray(req.body) || req.body.length !== 2) {
            return res.status(400).send({message: "Bad request"});
        }

        // Store user in variable
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check whether the client has permission to manage (edit) users
        checkPermission(userId, {type: "USER_MANAGE"}).then(async (result: boolean) => {
            // If no permission, send 403
            if (!result) {
                return res.status(403).send({message: "You are unauthorized to edit users."});
            }

            const dbGroups = res.locals.user.groups;

            // Remove all groups currently assigned to user
            for (const group of dbGroups) {
                await (res.locals.user as User).$remove('groups', group).then(_ => {
                });
            }

            // Add all groups as stated in the request
            for (const groupData of req.body[1]) {
                await Group.findByPk(groupData.id).then(async (specificGroup: Group) => {
                    await (res.locals.user as User).$add('groups', specificGroup, {through: {func: groupData.role}})
                        .then(() => {
                        })
                        .catch((err: Error) => {
                            logger.error("user.route./:id.put: " + err);
                        });
                });
            }

            // Update the user in the database
            res.locals.user.update(req.body[0]).then((updatedUser: User) => {

                // Transform updated user to web model
                UserWeb.getWebModelFromDbModel(updatedUser).then((webUser: UserWeb) => {
                    // Send edited user back to the client.
                    return res.status(200).send(webUser);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.sendStatus(500);
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(400);
            });
        });
    })

    /**
     * Delete user from the database
     */
    .delete((req: Request, res: Response) => {
        // Store user in variable
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has the permission to manage (delete) users
        checkPermission(userId, {type: "USER_MANAGE"}).then((result: boolean) => {

            // If no permission, send 403
            if (!result) {
                return res.status(403).send({message: "You are unauthorized to delete users."});
            }

            // Destroy user in database
            res.locals.user.destroy().then(() => {
                return res.sendStatus(201);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    });

router.route("/changePassword/:id")
    /**
     * Change the password of a user
     */
    .put((req: Request, res: Response) => {
        // Check if client has a session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to change password of user
        checkPermission(userId, {type: "CHANGE_PASSWORD", value: +req.params.id}).then(function(result: boolean): any {

            // If no permission, send 403
            if (!result) {
                return res.status(403).send({
                    message: "You do not have permission to change the password of the " +
                        "requested user."
                });
            }

            // Get user from database
            User.findByPk(req.params.id, {
                attributes: ["id", "firstName", "lastName", "email", "passwordHash", "passwordSalt"],
                include: [Role]
            }).then(function(foundUser: User): any {
                // User definitely exists. If not, it would have been filtered out in the checkPermission call.

                // Get the hash of the (original) password the user put
                const inputtedPasswordHash =
                    getPasswordHashSync(req.body.password, foundUser.passwordSalt);

                // Check if it is indeed the correct password
                if (Buffer.compare(inputtedPasswordHash, Buffer.from(foundUser.passwordHash)) !== 0) {
                    return res.status(406).send({
                        message: "The password submitted is not the current" +
                            " password of this user."
                    });
                }

                if (typeof req.body.passwordNew !== "string" || typeof req.body.passwordNew2 !== "string") {
                    return res.status(400).send({message: "The passwords submitted were not of type " +
                            "'string'"});
                }

                // Check if both newly inputted passwords are the same
                if (req.body.passwordNew !== req.body.passwordNew2) {
                    return res.status(406).send({
                        message: "The pair of new passwords submitted was not " +
                            "equal."
                    });
                }

                // Generate new salt and hash
                const passwordSalt: string = generateSalt(passwordSaltLength); // Create salt of 16 characters
                const passwordHash = getPasswordHashSync(req.body.passwordNew, passwordSalt);

                // Update user in database with new password and hash
                return foundUser.update({
                    passwordHash,
                    passwordSalt
                }).then((updatedUser: User) => {
                    // Send updated user to the client
                    return res.status(200).send(updatedUser);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.status(400).send("Was not able to update password.");
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            return res.sendStatus(400);
        });
    });

router.route("/approve/:approvalString")
    /**
     * Function for approving a user account based on the approvalString
     */
    .all((req: Request, res: Response) => {
        // Get the approval string
        const approvalString = req.params.approvalString;

        // Find the user whose approval string matches the url
        User.findOne({where: {approvingHash: approvalString}}).then((foundUser: User) => {

            if (!foundUser) {
                // If the same link is clicked again in the email
                res.writeHead(200, {
                    location: '/login'
                });
                return res.send();
            }

            // If user is found, approve user, and redirect.
            foundUser.update({approved: true, approvingHash: generateSalt(approvalStringLength - 1)})
                .then((_: User) => {
                    res.writeHead(200, {
                        location: '/completed_registration'
                    });
                    return res.send();
                });
        });
    });

module.exports = router;

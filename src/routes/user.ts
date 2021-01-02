import express, {Request, Response, Router} from "express";

import {User} from "../models/user.model";
import {Group} from "../models/group.model";
import {Role} from "../models/role.model";

const permissions: any = require("../permissions");
import {generateSalt, getPasswordHashSync} from "../helpers/authHelper";
import {createTestAccount, createTransport} from "nodemailer";

const router: Router = express.Router();

router.route("/")
    /**
     * Gets all users from the database
     */
    .get(function(req: Request, res: Response): void {
        // Check if the client is logged in
        const userId: number = res.locals.session ? res.locals.session.user : null;

        // Check if the client has permission to manage users
        permissions.check(userId, {
            type: "USER_MANAGE",
            value: userId
        }).then(function(result: boolean): void {
            // If no result, then the client has no permission
            if (!result) { res.sendStatus(403); }

            // If client has permission, find all users in database
            User.findAll({
                attributes: ["id", "displayName", "email"],
                include: [User.associations.role],
                order: [
                    ["id", "ASC"]
                ]
            }).then(function(foundUsers: User[]): void {
                // Send the users back to the client
                res.send(foundUsers);
            });
        }).done();
    })

    /**
     * Creates a new user in the database
     */
    .post(function(req: Request, res: Response): any {
        // Check if required fields are filled in
        if (!req.body.displayName || !req.body.email || !req.body.password) {
            return res.sendStatus(400);
        }

        // generate approvingHash, passwordSalt and passwordHash
        req.body.approvingHash = generateSalt(24);
        req.body.passwordSalt = generateSalt(16);
        req.body.passwordHash = getPasswordHashSync(req.body.password, req.body.passwordSalt);

        // Delete password permanently
        delete req.body.password;

        // Set role to be the default member role
        req.body.role = Role.findOne({
            where: {
                name: 'Member'
            }
        });

        // Create new user in database
        return User.create(req.body).then(function(createdUser: User): void {
            // Send approval email to email
            createTestAccount().then(function(): void {

                // TODO test if this works?? Same as in expressServer
                const transporter: any = createTransport({
                    service: 'gmail',
                    secure: true,
                    // Never fill this password in and add it to git! Only filled in locally or on the server!
                    auth: {
                        user: 'web@hsaconfluente.nl',
                        pass: ''
                    }
                });

                const link: string = "https://www.hsaconfluente.nl/api/user/approve/" + req.body.approvingHash;

                transporter.sendMail({
                    from: '"website" <web@hsaconfluente.nl>',
                    to: req.body.email,
                    subject: "Registration H.S.A. Confluente",
                    text: "Thank you for making an account on our website hsaconfluente.nl! \n To fully activate your account, please visit this link: https://www.hsaconfluente.nl/api/user/approve/" + req.body.approvingHash,
                    html: "<h3>&nbsp;</h3><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"padding: 10px 0 30px 0;\"><table style=\"border: 1px solid #cccccc; border-collapse: collapse;\" border=\"0\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\"><tbody><tr><td style=\"padding: 40px 30px 40px 30px;\" bgcolor=\"#ffffff\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color: #153643; font-family: Arial, sans-serif; font-size: 24px;\"><h3><strong>Hooray! Welcome to H.S.A. Confluente</strong></h3></td></tr><tr><td style=\"padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\">Thank you for signing up to the website of H.S.A. Confluente at <a href=\"http://www.hsaconfluente.nl\">www.hsaconfluente.nl</a>. To activate your account on our website, please click the  <a href='" + link + "'>here!</a></td></tr><tr><td><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td valign=\"top\" width=\"260\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr style=\"height: 140px;\"><td style=\"padding: 25px 0px 0px; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; height: 140px;\"><h4>Events</h4><p>Now that you have an account on the H.S.A. Confluente website, you can subscribe to all the wonderful events that H.S.A. Confluente is organizing. Want to see what activities are coming up? <a href=\"https://hsaconfluente.nl/activities\">Click here!</a></p></td></tr></tbody></table></td><td style=\"font-size: 0; line-height: 0;\" width=\"20\">&nbsp;</td><td valign=\"top\" width=\"260\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr style=\"height: 140px;\"><td style=\"padding: 25px 0px 0px; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; height: 140px;\"><h4>Want to learn more?</h4><p>Are you interested in what H.S.A. Confluente is or can offer you? Then go and take an extensive look at our <a href=\"https://hsaconfluente.nl/\">website</a>! You can find pictures of all previous boards as well as information about what committees we have at H.S.A. Confluente!.</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"padding: 30px 30px 30px 30px;\" bgcolor=\"#1689ad\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;\" width=\"75%\">Web Commttee H.S.A. Confluente, TU/e 2020</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>"
                }).then(function(info: any): void {
                });
            });
            res.status(201).send(createdUser);
        }).catch(function(): void {
            res.status(406).send("Account with identical email already exists");
        }).done();
    });

// Specific user route
router.route("/:id")
    /**
     * Gets the user and stores it in res.locals.user
     */
    .all(function(req: Request, res: Response, next: any): any {
        // Check if client has a session
        const user: number = res.locals.session ? res.locals.session.user : null;

        // If client does not have a session, he does not have permission
        if (user === null) { return res.send(403); }

        // Get user from database
        User.findByPk(req.params.id, {
            attributes: ["id", "firstName", "lastName", "displayName", "major", "address", "track", "honorsGeneration", "honorsMembership", "campusCardNumber", "mobilePhoneNumber", "email", "consentWithPortraitRight"],
            include: [User.associations.role],
        }).then(function(foundUser: User): void {
            // Return if user not found
            if (foundUser === null) {
                res.status(404).send({status: "Not Found"});
            } else {
                // Store user and go to next function
                res.locals.user = user;

                next();
            }
        });
    })

    /**
     * Get a specific user from the database and return to the client
     */
    .get(function(req: Request, res: Response): any {
        // store user in variable
        const user: number = res.locals.session.user;

        // Check whether user has permission to see the information of the user requested
        permissions.check(user, {type: "USER_VIEW", value: req.params.id}).then(function(result: boolean): any {
            // If no permission, return 403
            if (!result) { return res.sendStatus(403); }

            // If permission, find all groups in the database, that the requested user is a member of.
            Group.findAll({
                attributes: ["id", "fullName", "canOrganize"],
                include: [
                    {
                        model: User,
                        as: "members",
                        attributes: ["id"],
                        where: {
                            id: req.params.id
                        }
                    }
                ]
            }).then(function(foundGroups: Group[]): void {
                // Send user together with group back to client
                res.send([res.locals.user, foundGroups]);
            });
        });
    })

    /**
     * Edit a user
     */
    .put(function(req: Request, res: Response): any {
        // Store user in variable
        const user: number = res.locals.session.user;

        // Check whether the client has permission to manage (edit) users
        permissions.check(user, {
            type: "USER_MANAGE",
            value: res.locals.user.id
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) {
                return res.sendStatus(403);
            }

            // Find all groups that the user edited is currently a member of
            Group.findAll({
                attributes: ["id", "fullName"],
                include: [
                    {
                        model: User,
                        as: "members",
                        attributes: ["id"],
                        where: {
                            id: req.params.id
                        }
                    }
                ]
            }).then(function(foundGroups: Group[]): any {
                // Remove all existing group relations from the database
                for (const foundGroup of foundGroups) {
                    foundGroup.members[0].user_group.destroy();
                    foundGroup.getUsers().then(function(members: User[]): void {
                        members[0]
                    });
                }

                // Add all groups as stated in the request
                req.body[1].forEach(function(groupData: any): void {
                    if (groupData.selected) {
                        Group.findByPk(groupData.id).then(function(specificGroup: Group): void {
                            res.locals.user.addGroups(specificGroup, {through: {func: groupData.role}})
                                .then(console.log);
                        });
                    }
                });

                // Update the user in the database
                return res.locals.user.update(req.body[0]).then(function(returnedUser: User): void {
                    // Send edited user back to the client.
                    res.send(returnedUser);
                }, function(err: Error): void {
                    console.error(err);
                });
            }).done();

        });
    })

    /**
     * Delete user from the database
     */
    .delete(function(req: Request, res: Response): any {
        // Store user in variable
        const user: number = res.locals.session.user;

        // Check if client has the permission to manage (delete) users
        permissions.check(user, {
            type: "USER_MANAGE",
            value: res.locals.user.id
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Destroy user in database
            return res.locals.user.destroy();
        }).then(function(): void {
            res.status(204).send({status: "Successful"});
        });
    });

router.route("/changePassword/:id")
    /**
     * Change the password of a user
     */
    .put(function(req: Request, res: Response): any {
        // Check if client has a session
        const user: number = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to change password of user
        permissions.check(user, {type: "CHANGE_PASSWORD", value: req.params.id}).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Get user from database
            User.findByPk(req.params.id, {
                attributes: ["id", "displayName", "email", "passwordHash", "passwordSalt"],
                include: [User.associations.role]
            }).then(function(foundUser: User): any {
                // If user does not exist, send 404
                if (foundUser === null) {
                    return res.status(404).send({status: "Not Found"});
                } else {
                    // Get the hash of the (original) password the user put
                    const inputtedPasswordHash: string =
                        getPasswordHashSync(req.body.password, foundUser.passwordSalt);

                    // Check if it is indeed the correct password
                    if (inputtedPasswordHash === foundUser.passwordHash) {
                        return res.status(406).send({status: "Not equal passwords"});
                    }

                    // Check if both newly inputted passwords are the same
                    if (req.body.passwordNew !== req.body.passwordNew2) {
                        return res.status(406).send({status: "Not equal new passwords"});
                    }

                    // Generate new salt and hash
                    const passwordSalt: string = generateSalt(16); // Create salt of 16 characters
                    const passwordHash: string = getPasswordHashSync(req.body.passwordNew, passwordSalt);

                    // Update user in database with new password and hash
                    return foundUser.update({
                        passwordHash,
                        passwordSalt
                    }).then(function(updatedUser: User): any {
                        // Send updated user to the client
                        return res.send(updatedUser);
                    }, function(err: Error): void {
                        console.error(err);
                    });
                }
            }).done();
        });
    });

router.route("/approve/:approvalString")
    /**
     * Function for approving a user account based on the approvalString
     */
    .all(function(req: Request, res: Response): any {
        // Get the approval string
        const approvalString = req.params.approvalString;

        // Check if it has the correct length
        if (approvalString.length !== 24) {
            return res.send(401);
        }

        // Find the user whose approval string matches the url
        User.findOne({where: {approvingHash: approvalString}}).then(function(foundUser: User): any {
            if (!foundUser) {
                // If the same link is clicked again in the email
                res.writeHead(301, {
                    location: '/login'
                });
                res.send();
            }

            foundUser.update({approved: true, approvingHash: generateSalt(23)})
                .then(function(result: any): void {
                res.writeHead(301, {
                    location: '/completed_registration'
                });
                res.send();
            });
        });
    });

module.exports = router;

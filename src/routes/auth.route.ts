import express, {Request, Response, Router} from "express";

import {User} from "../models/database/user.model";
import {Group} from "../models/database/group.model";
import {authenticate, startSession} from "../helpers/auth.helper";
import {UserWeb} from "../models/web/user.web.model";
import {Session} from "../models/database/session.model";
import {Op} from "sequelize";

const router: Router = express.Router();

router.route("/")
    /**
     * Function for getting the profile of the user.
     */
    .get((req: Request, res: Response) => {
        // Check whether the response has a session (handled by express)
        if (!res.locals.session) {
            return res.status(401).send({message: "Request does not have a session."});
        }

        // find the user of the session in the database
        User.findOne({
            attributes: ["id", "email", "firstName", "lastName", "consentWithPortraitRight", "roleId"],
            include: [{
                model: Group,
                attributes: ["id", "displayName", "fullName", "description", "canOrganize", "email"]
            }, {
                model: Session,
                where: {token: {[Op.like]: res.locals.session.token}}
            }],
        }).then((foundUser: User) => {

            // If no user was found, send an error
            if (foundUser === undefined || foundUser === null) {
                res.status(400).send("Could not find user associated session token");
            }

            // get the data values of the user
            UserWeb.getWebModelFromDbModel(foundUser).then((profile: UserWeb) => {
                // send the profile back the client
                res.status(200).send(profile);
            });
        });
    });

router.route("/login")
    /**
     * Function for logging a user in.
     */
    .post((req: Request, res: Response) => {
        // Check if both the email and password field were filled in
        if (!req.body.email || !req.body.password) {
            return res.sendStatus(400);
        }

        // authenticate user
        authenticate(req.body.email, req.body.password).then((foundUser: User) => {

            // check if user account is approved
            if (foundUser.approved === false) {
                return res.status(406).send({message: "User account has not yet been approved"});
            }

            res.locals.user = foundUser;

            // start a new session and send that session back to the client
            return startSession(foundUser.id, req.ip)
                .then((session: any) => {
                    res.cookie('session', session.token.toString("base64"), { expires: session.expires });
                    res.status(200).send({message: "Logged in successfully!"});
                });
        }).catch((err: Error) => {
            // Authentication failed, send back error
            return res.status(400).send({error: err});
        });
    });

module.exports = router;

import express, {Request, Response, Router} from "express";

import {User} from "../models/database/user.model";
import {Group} from "../models/database/group.model";
import {authenticate, startSession} from "../helpers/auth.helper";
import {Role} from "../models/database/role.model";
import {UserWeb} from "../models/web/user.web.model";

const router: Router = express.Router();

router.route("/")
    /**
     * Function for getting the profile of the user.
     */
    .get(function(req: Request, res: Response, next: any): any {
        // Check whether the response has a session (handled by express)
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // find the user of the session in the database
        User.findByPk(res.locals.session.user, {
            attributes: ["id", "email", "displayName", "consentWithPortraitRight"],
            include: [{
                model: Group,
                attributes: ["id", "displayName", "fullName", "description", "canOrganize", "email"]
            }, Role]
        }).then(function(foundUser: User): void {
            // get the datavalues of the user
            UserWeb.getWebModelFromDbModel(foundUser).then(function(profile: UserWeb): void {
                // send the profile back the client
                res.send(profile);
            });
        });
    });

router.route("/login")
    /**
     * Function for logging a user in.
     */
    .post(function(req: Request, res: Response, next: any): any {
        // Check if both the email and password field were filled in
        if (!req.body.email || !req.body.password) {
            return res.sendStatus(400);
        }

        // initialize variables
        const credentials: any = {
            email: req.body.email,
            password: req.body.password
        };

        // authenticate user
        authenticate(req.body.email, req.body.password).then(function(foundUser: User): any {

            // check if user account is approved
            if (foundUser.approved === false) {
                return res.status(406).send({error: 406, data: "User account has not yet been approved"});
            }

            res.locals.user = foundUser;

            // start a new session and send that session back to the client
            return startSession(foundUser.id, req.ip)
                .then(function(session: any): void {
                    res.cookie('session', session.token.toString("base64"), { expires: session.expires });
                    res.status(200).send({});
                });
        }).catch(function(err: Error): any {
            // Authentication failed, send back error
            return res.status(400).send({error: err});
        });
    });

module.exports = router;

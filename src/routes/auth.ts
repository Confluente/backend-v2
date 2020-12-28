import {Express} from "express";

const express: any = require("express");

import "../models/user";
import "../models/group";
import {any} from "codelyzer/util/function";

const users: any = require("../models/user");
const groups: any = require("../models/group");
const authHelper: any = require("../authHelper");

const router: Express.Router = express.Router();

router.route("/")
    /**
     * Function for getting the profile of the user.
     */
    .get(function(req: Express.Request, res: Express.Response, next: any): any {
        // Check whether the response has a session (handled by express)
        if (!res.locals.session) {
            return res.sendStatus(401);
        }

        // find the user of the session in the database
        users.findByPk(res.locals.session.user, {
            attributes: ["id", "email", "displayName", "isAdmin", "consentWithPortraitRight"],
            include: [{
                model: Group,
                attributes: ["id", "displayName", "fullname", "description", "canOrganize", "email"]
            }]
        }).then(function(foundUser: User): void {
            // get the datavalues of the user
            const profile: any = foundUser.dataValues;

            // set whether the user can organize activities
            profile.canOrganize = profile.isAdmin || profile.groups.some(function(groupOfUser: Group): boolean {
                return groupOfUser.canOrganize;
            });

            // send the profile back the client
            res.send(profile);
        });
    });

router.route("/login")
    /**
     * Function for logging a user in.
     */
    .post(function(req: Express.Request, res: Express.Response, next: any): any {
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
        authHelper.authenticate(req.body.email, req.body.password).then(function(foundUser: User): any {
            // check if error occurred
            if (foundUser.error === 406) {
                return res.status(406).send(foundUser);
            }

            // check if user account is approved
            if (foundUser.approved === false) {
                return res.status(406).send({error: 406, data: "User account has not yet been approved"});
            }

            res.locals.user = foundUser;

            // start a new session and send that session back to the client
            return authHelper.startSession(foundUser.id, req.ip)
                .then(function(session: any): void {
                    res.cookie('session', session.token.toString("base64"), { expires: session.expires });
                    res.status(200).send({});
                });
        }).catch(function(err: Error): any {
            return res.status(500).send({error: err});
        });
    });

module.exports = router;

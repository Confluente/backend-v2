import express, {Request, Response, Router} from "express";

import {User} from '../models/database/user.model';

const router: Router = express.Router();

router.route("/portraitRight/:id")
    /**
     * Function for changing the consentWithPortraitRight attribute of a user
     */
    .put(function(req: Request, res: Response): any {
        // Check if user is logged in
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        if (userId === null) {
            return res.status(400).send({message: "Session needs to be active for changing portrait " +
                    "right preferences."});
            // return res.sendStatus(400);
        }

        // Check if user id of logged in user is the same as user id for which request was send
        if (parseInt(req.params.id, undefined) !== userId) {
            return res.status(400).send({message: "Change of portrait right settings not allowed " +
                    "for other users."});
        }

        // Retrieve user from database
        User.findByPk(userId).then(function(user: User | null): void {

            if (user === null) {
                // If requested user is not in the database, then the request was faulty.
                res.status(400).send("User for which change was requested is not known in the database.");
            }

            // Update user object in database
            user.update({consentWithPortraitRight: req.body.answer}).then(function(_: User): any {
                res.sendStatus(200);
            });
        });
    });

module.exports = router;

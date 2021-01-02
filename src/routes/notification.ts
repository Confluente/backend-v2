import express, {Request, Response, Router} from "express";

import {User} from '../models/User';

const router: Router = express.Router();

router.route("/portraitRight/:id")
    /**
     * Function for changing the consentWithPortraitRight attribute of a user
     */
    .put(function(req: Request, res: Response): any {
        // Check if user is logged in
        const userId: number = res.locals.session ? res.locals.session.user : null;

        // Check if user id of logged in user is the same as user id for which request was send
        if (parseInt(req.params.id, undefined) !== userId) { return res.sendStatus(403); }

        // Retrieve user from database
        User.findByPk(userId).then(function(user: User): void {
            // Update user object in database
            user.update({consentWithPortraitRight: req.body.answer}).then(function(result: User): any {
                res.send(user);
            });
        });
    });

module.exports = router;

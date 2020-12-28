import {Express} from "express";

const express: any = require("express");

import "../models/group";
import "../models/user";

const users: any = require("../models/user");
const groups: any = require("../models/group");
const permissions: any = require("../permissions");

const router: Express.Router = express.Router();

router.route("/")
    .all(permissions.requireAll({type: "GROUP_MANAGE"}))

    /**
     * Gets all groups from the database
     */
    .get(function(req: Express.Request, res: Express.Response, next: any): void {
        groups.findAll({
            attributes: ["id", "fullName", "displayName", "description", "email", "canOrganize", "type", "createdAt"],
            order: [
                ["id", "ASC"]
            ]
        }).then(function(foundGroups: Group[]): void {
            // Sends the groups back to the client
            res.send(foundGroups);
        });
    })

    /**
     * Creates a new group
     */
    .post(function(req: Express.Request, res: Express.Response, next: void): any {

        // Checks if the client is logged in
        if (!res.locals.session) { return res.sendStatus(401); }

        // Checks if all required fields are filled in
        if (!req.body.displayName || !req.body.fullName || !req.body.description || !req.body.email) {
            return res.sendStatus(400);
        }

        // Checks if the client has permission to create a group
        permissions.check(res.locals.session.user, {
            type: "GROUP_CREATE",
            value: req.body.organizer
        }).then(function(result: boolean): any {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Create group in the database
            return groups.create(req.body).then(function(createdGroup: Group): void {
                // Send created group back to the client
                res.status(201).send(result);
            }).catch(function(err: Error): void {
                console.error(err);
            });
        }).done();
    });

router.route("/:id")
    /**
     * Gets a specific group from the database and stores it in res.locals.group
     */
    .all(function(req: Express.Request, res: Express.Response, next: any): any {
        groups.findByPk(req.params.id, {
            attributes: ["id", "fullName", "displayName", "description", "email", "canOrganize", "type", "createdAt"],
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: ["displayName"]
                }
            ]
        }).then(function(foundGroup: Group): void {
            // If group does not exists, send 404
            if (foundGroup === null) {
                res.status(404).send({status: "Not Found"});
            } else {
                // Store group
                res.locals.group = foundGroup;
                next();
            }
        });
    })

    /**
     * Sends group from the database to the client
     */
    .get(function(req: Express.Request, res: Express.Response): any {
        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to view the group
        permissions.check(user, {type: "GROUP_VIEW", value: req.params.id}).then(function(result: boolean): any {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Send group to client
            res.send(res.locals.group);
        }).done();
    })

    /**
     * Edits a group in the database
     */
    .put(function(req: Express.Request, res: Express.Response): any {

        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to manage groups
        permissions.check(user, {
            type: "GROUP_MANAGE",
            value: res.locals.group.id
        }).then(function(result: boolean): any {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Update the database
            return res.locals.group.update(req.body[0]).then(function(updatedGroup: Group): void {

                // remove all current group members
                for (const member of updatedGroup.members) {
                    member.user_group.destroy();
                }

                // add all new group members
                req.body[1].forEach(function(new_group_member: any): any {
                    users.findByPk(new_group_member.id).then(function(newUser: User): void {
                        newUser.addGroups(res.locals.group, {through: {func: new_group_member.func}}).then(console.log);
                    });
                });

                // Send new group to the client
                res.send(updatedGroup);
            }, function(err: Error): void {
                console.error(err);
            });
        });
    })

    /**
     * Deletes a group from the database
     */
    .delete(function(req: Express.Request, res: Express.Response): any {

        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.user : null;

        // Check if client has permission to manage groups
        permissions.check(user, {
            type: "GROUP_MANAGE",
            value: res.locals.group.id
        }).then(function(result: boolean): any {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Destroy group in database
            return res.locals.group.destroy();
        }).then(function(): void {
            res.status(204).send({status: "Successful"});
        });
    });

router.route("/type/:type")
    /**
     * Gets all groups of a certain type from the database
     */
    .get(function(req: Express.Request, res: Express.Response): void {
        groups.findAll({
            attributes: ["id", "fullName", "displayName", "description", "email"],
            where: {type: req.params.type},
            order: [
                ["id", "ASC"]
            ]
        }).then(function(foundGroups: Group[]): void {
            res.send(foundGroups);
        });
    });
module.exports = router;
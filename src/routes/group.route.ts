import express, {Request, Response, Router} from "express";

import {Group} from "../models/database/group.model";
import {User} from "../models/database/user.model";

import {checkPermission} from "../permissions";
import {GroupWeb} from "../models/web/group.web.model";
import {logger} from "../logger";

const router: Router = express.Router();

router.route("/")
    /**
     * Gets all groups from the database
     */
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const userId = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, { type: "GROUP_VIEW" }).then((result: boolean) => {
            // If false then return 403
            if (!result) { return res.sendStatus(403); }

            Group.findAll({
                attributes: ["id", "fullName", "displayName", "description", "email", "canOrganize", "type"],
                order: [
                    ["id", "ASC"]
                ]
            }).then(async (foundGroups: Group[]) => {

                // Transform dbGroups to webGroups
                const groups = await GroupWeb.getArrayOfWebModelsFromArrayOfDbModels(foundGroups);

                // Sends the groups back to the client
                return res.send(groups);
            });

        }).catch((_: Error) => {
            // Bad request
            return res.sendStatus(400);
        });
    })

    /**
     * Creates a new group
     */
    .post((req: Request, res: Response) => {
        // Check if client is logged in
        const userId = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, { type: "GROUP_MANAGE" }).then((result: boolean) => {
            // If false then return 403
            if (!result) { return res.sendStatus(403); }

            // Checks if all required fields are filled in
            if (!req.body.displayName || !req.body.fullName || !req.body.description || !req.body.email
                || !req.body.type) {
                return res.sendStatus(400);
            }
            // Create group in the database
            Group.create(req.body).then((created_group: Group) => {
                // Send created group back to the client
                return res.status(201).send(created_group);
            }).catch((err: Error): void => {
                logger.error(err);
            });

        }).catch((_: Error) => {
            // Bad request
            return res.sendStatus(400);
        });

    });

router.route("/:id")
    /**
     * Gets a specific group from the database and stores it in res.locals.group
     */
    .all((req: Request, res: Response, next: any) => {
        Group.findByPk(req.params.id, {
            attributes: ["id", "fullName", "displayName", "description", "email", "canOrganize", "type"],
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: ["id", "firstName", "lastName"]
                }
            ]
        }).then((foundGroup: Group) => {
            // If group does not exists, send 404
            if (foundGroup === null) {
                return res.status(404).send({status: "Not Found"});
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
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to view the group
        checkPermission(user, {type: "GROUP_VIEW", value: +req.params.id})
            .then((result: boolean) => {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Transform dbGroup to webGroup
            GroupWeb.getWebModelFromDbModel(res.locals.group).then((webGroup: GroupWeb) => {
                // Send group to client
                return res.status(200).send(webGroup);
            });
        });
    })

    /**
     * Edits a group in the database
     */
    .put((req: Request, res: Response) => {

        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to manage groups
        checkPermission(user, {
            type: "GROUP_MANAGE",
            value: res.locals.group.id
        }).then((result: boolean) => {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Update the database
            return res.locals.group.update(req.body).then((updatedGroup: Group) => {

                // remove all current group members
                for (const member of updatedGroup.members) {
                    member.$remove('groups', updatedGroup);
                }

                // add all new group members
                req.body.members.forEach((new_group_member: any) => {
                    User.findByPk(new_group_member.id).then((newUser: User): void => {
                        newUser.$add('groups', res.locals.group, {through: {func: new_group_member.func}})
                            .then(console.log);
                    });
                });

                // Send updated group to the client
                return res.status(201).send(updatedGroup);
            }, (err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        });
    })

    /**
     * Deletes a group from the database
     */
    .delete((req: Request, res: Response) => {

        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to manage groups
        checkPermission(user, {
            type: "GROUP_MANAGE",
            value: res.locals.group.id
        }).then((result: boolean) => {

            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Destroy group in database
            return res.locals.group.destroy();
        }).then(() => {
            return res.status(204).send({status: "Successful"});
        });
    });

router.route("/type/:type")
    /**
     * Gets all groups of a certain type from the database
     */
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const user: number = res.locals.session ? res.locals.session.userId : null;

        // Check if client has permission to view the group
        checkPermission(user, {type: "GROUP_VIEW"})
            .then((result: boolean) => {

                // If no permission, send 403
                if (!result) { return res.sendStatus(403); }

                Group.findAll({
                    attributes: ["id", "fullName", "displayName", "description", "email"],
                    where: {type: req.params.type},
                    order: [
                        ["id", "ASC"]
                    ]
                }).then((foundGroups: Group[]) => {
                    // Transform dbGroups to webGroups
                    GroupWeb.getArrayOfWebModelsFromArrayOfDbModels(foundGroups).then((groups: any) => {
                        return res.status(200).send(groups);
                    }).catch((_: any) => {
                        return res.sendStatus(500);
                    });
                });

            });
    });
module.exports = router;

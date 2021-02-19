import express, {Router, Request, Response} from "express";

import {Role} from "../models/database/role.model";

import {checkPermission} from "../permissions";
import {RoleWeb} from "../models/web/role.web.model";

const router: Router = express.Router();

router.route("/")
    /**
     * Gets all roles from the database
     */
    .get(function(req: Request, res: Response, next: any): void {
        // Check if the client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        // Check if the client has permission to manage roles
        checkPermission(user, {
            type: "ROLE_MANAGE",
            value: user
        }).then(function(result: boolean): void {
            // If no result, then the client has no permission
            if (!result) { res.sendStatus(403); }

            // If client has permission, find all roles in database
            Role.findAll({
                attributes: ["name", "PAGE_VIEW", "PAGE_MANAGE", "USER_CREATE", "USER_VIEW_ALL", "USER_MANAGE",
                    "CHANGE_ALL_PASSWORDS", "ROLE_VIEW", "ROLE_MANAGE", "ACTIVITY_VIEW_PUBLISHED",
                    "ACTIVITY_VIEW_ALL_UNPUBLISHED", "ACTIVITY_MANAGE"],
                order: [
                    ["id", "ASC"]
                ]
            }).then(function(foundRoles: Role[]): void {
                // Transform dbRoles to webRoles
                const roles = RoleWeb.getArrayOfWebModelsFromArrayOfDbModels(foundRoles);

                // Send the roles back to the client
                res.send(roles);
            });
        });
    })

    /**
     * Creates a new role in the database
     */
    .post(function(req: Request, res: Response, next: any): any {
        // Check if required fields are filled in
        if (!req.body.name || req.body.PAGE_VIEW == null || req.body.PAGE_MANAGE == null || req.body.USER_CREATE == null
            || req.body.USER_VIEW_ALL == null || req.body.USER_MANAGE == null || req.body.CHANGE_ALL_PASSWORDS == null
            || req.body.ROLE_VIEW == null || req.body.ROLE_MANAGE == null || req.body.ACTIVITY_VIEW_PUBLISHED == null
            || req.body.ACTIVITY_VIEW_ALL_UNPUBLISHED == null || req.body.ACTIVITY_MANAGE == null) {
            return res.sendStatus(400);
        }

        // Create new role in database
        return Role.create(req.body).then(function(createdRole: Role): void {
            res.status(201).send(createdRole);
        }).catch(function(err: Error): void {
            res.status(406).send("Role with identical name already exists");
        }).done();
    });

// Specific role route
router.route("/:id")
    /**
     * Get a specific role from the database and return to the client
     */
    .get(function(req: Request, res: Response): any {
        // Check if client has a session
        const user = res.locals.session ? res.locals.session.userId : null;

        // If client does not have a session, he does not have permission
        if (user === null) { return res.send(403); }

        checkPermission(user, {
            type: "ROLE_MANAGE",
            value: user
        }).then(function(result: boolean): void {
            // If no result, then the client has no permission
            if (!result) { res.sendStatus(403); }

            // If client has permission, get the role from the database
            Role.findByPk(req.params.id, {
                attributes: ["name", "PAGE_VIEW", "PAGE_MANAGE", "USER_CREATE", "USER_VIEW_ALL", "USER_MANAGE",
                    "CHANGE_ALL_PASSWORDS", "ROLE_VIEW", "ROLE_MANAGE", "ACTIVITY_VIEW_PUBLISHED",
                    "ACTIVITY_VIEW_ALL_UNPUBLISHED", "ACTIVITY_MANAGE"],
            }).then(function(foundRole: Role): void {
                // Return if role not found
                if (foundRole === null) {
                    res.status(404).send({status: "Not Found"});
                } else {
                    // Transform dbRole into webRole
                    const role = RoleWeb.getWebModelFromDbModel(foundRole);

                    // Return the role
                    res.send(role);
                }
            });
        });
    })

    /**
     * Edit a role
     */
    .put(function(req: Request, res: Response): any {
        // Check if client has a session
        const user = res.locals.session ? res.locals.session.userId : null;

        // If client does not have a session, he does not have permission
        if (user === null) { return res.send(403); }

        // Check whether the client has permission to manage (edit) roles
        checkPermission(user, {
            type: "ROLE_MANAGE",
            value: res.locals.user.id
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) {
                return res.sendStatus(403);
            }

            // Find the role
            Role.findByPk(req.params.id, {
                attributes: ["name", "PAGE_VIEW", "PAGE_MANAGE", "USER_CREATE", "USER_VIEW_ALL", "USER_MANAGE",
                    "CHANGE_ALL_PASSWORDS", "ROLE_VIEW", "ROLE_MANAGE", "ACTIVITY_VIEW_PUBLISHED",
                    "ACTIVITY_VIEW_ALL_UNPUBLISHED", "ACTIVITY_MANAGE"],
            }).then(function(role: Role): any {
                // Return if role not found
                if (role === null) {
                    res.status(404).send({status: "Not Found"});
                } else {
                    return role.update(req.body).then(function(updatedRole: Role): void {
                        res.send(updatedRole);
                    }, function(err: Error): void {
                        console.log(err);
                    });
                }
            }).done();
        });
    })

    /**
     * Delete role from the database
     */
    .delete(function(req: Request, res: Response): any {
        // Check if client has a session
        const user = res.locals.session ? res.locals.session.userId : null;

        // If client does not have a session, he does not have permission
        if (user === null) { return res.send(403); }

        // Check if client has the permission to manage (delete) roles
        checkPermission(user, {
            type: "ROLE_MANAGE",
            value: res.locals.user.id
        }).then(function(result: boolean): any {
            // If no permission, send 403
            if (!result) { return res.sendStatus(403); }

            // Find the role
            Role.findByPk(req.params.id, {
                attributes: ["name", "PAGE_VIEW", "PAGE_MANAGE", "USER_CREATE", "USER_VIEW_ALL", "USER_MANAGE",
                    "CHANGE_ALL_PASSWORDS", "ROLE_VIEW", "ROLE_MANAGE", "ACTIVITY_VIEW_PUBLISHED",
                    "ACTIVITY_VIEW_ALL_UNPUBLISHED", "ACTIVITY_MANAGE"],
            }).then(function(role: Role): void {
                // Return if role not found
                if (role === null) {
                    res.status(404).send({status: "Not Found"});
                } else {
                    // Destroy role in database
                    role.destroy();
                }
            });
        }).then(function(): void {
            res.status(204).send({status: "Successful"});
        });
    });

module.exports = router;

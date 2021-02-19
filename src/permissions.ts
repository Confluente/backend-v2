import {all} from "bluebird";
import {Request, Response} from "express";

import {User} from "./models/database/user.model";
import {Group} from "./models/database/group.model";
import {Activity} from "./models/database/activity.model";
import {Role} from "./models/database/role.model";
import {UserGroup} from "./models/database/usergroup.model";

/**
 * Checks whether user has required permissions for a given scope
 * @param user          User to check permissions for. Either database object, user ID or null for 'not logged in' user.
 * @param scope         Scope of the permission to be checked. Scope should be an object with a type attribute
 *                          containing the name of the permission to be checked and possibly a value attribute
 *                          containing the instance to be checked on (say, the group number that the user wants to see).
 * @returns boolean
 */
export function checkPermission(user: User | number, scope: { type: string, value?: number }): Promise<boolean> {
    return resolveUserAndRole(user)
            .then(function(res: {dbUser: User, role: Role, loggedIn: boolean}): Promise<boolean> {

        // Determine rule based on context
        switch (scope.type) {
            // If scope type is not listed, default case is executed, and the permission stated in the role is returned.
            // All more complicated permissions are listed here.
            case "USER_VIEW":
                // If requested without specified scope value, throw error.
                if (scope.value === undefined) {
                    throw new Error("permissions.checkPermission: USER_VIEW requires a scope value but was not given " +
                        "one");
                }

                // If request is submitted without a source user, throw error
                if (res.dbUser === null) {
                    throw new Error("permissions.checkPermission: USER_VIEW requires a user for which the request is" +
                        " made, but non was given");
                }

                return User.findByPk(scope.value).then(function(user_considered: User | null): boolean {
                    // If requested for non existing user, throw error.
                    if (user_considered === null) {
                        throw new Error("permissions.checkPermission: USER_VIEW permission was requested for non " +
                            "existing user.");
                    }

                    // Users can view their own account
                    const ownAccount: boolean = (res.dbUser.id === user_considered.id);
                    return ownAccount || res.role.USER_VIEW_ALL;
                });
            case "CHANGE_PASSWORD":
                // If requested without specified scope value, throw error.
                if (scope.value === undefined) {
                    throw new Error("permissions.checkPermission: CHANGE_PASSWORD requires a scope value but was not " +
                        "given one.");
                }

                // If request is submitted without a source user, throw error.
                if (res.dbUser === null) {
                    throw new Error("permissions.checkPermission: CHANGE_PASSWORD requires a user for which the " +
                        "request is made, but non was given.");
                }

                return User.findByPk(scope.value).then(function(user_considered: User | null): boolean {
                    // If requested for non existing user, throw error.
                    if (user_considered === null) {
                        throw new Error("permissions.checkPermission: Change password was requested for non existing user");
                    }

                    // Users can change their own password
                    const ownAccount = (res.dbUser.id === user_considered.id);
                    return ownAccount || res.role.CHANGE_ALL_PASSWORDS;
                });
            case "GROUP_ORGANIZE":
                // If requested without specified scope, throw error.
                if (scope.value === undefined) {
                    throw new Error("permission.checkPermission: GROUP_ORGANIZE requires a scope value but was not " +
                        "given one.");
                }

                // If not logged in, resolve as false.
                if (!res.loggedIn) {
                    return new Promise(function(resolve): void {
                        resolve(false);
                    });
                }
                return Group.findByPk(scope.value, {include: [User]})
                        .then(function(group: Group | null): boolean {

                    // If requested for non existing group, throw error.
                    if (group === null) {
                        throw new Error("permission.checkPermission: GROUP_ORGANIZE permission requested for non " +
                            "existing group. scope.value: " + scope.value);
                    }

                    // Check whether group is allowed to organize
                    if (!group.canOrganize) {
                        return res.role.GROUP_ORGANIZE_WITH_ALL;
                    }

                    // If the group is allowed to organize, check if user is in this group
                    const member = group.members.some(
                        function(mem: User & {UserGroup: any}): boolean {
                            return mem.id === res.dbUser.id;
                        });

                    // Return if user is in the group, or user is allowed to organize with all groups
                    return member || res.role.GROUP_ORGANIZE_WITH_ALL;
                });
            case "ACTIVITY_VIEW":
                // If requested without specified scope value, throw error.
                if (scope.value === undefined) {
                    throw new Error("permissions.checkPermission: ACTIVITY_VIEW requires a scope value but was not " +
                        "given one.");
                }

                return Activity.findByPk(scope.value, {include: [{model: Group, include: [User]}]})
                        .then(function(activity: Activity | null): boolean {
                    // If requested for non existing activity, throw error.
                    if (activity === null) {
                        throw new Error("permissions.checkPermission: ACTIVITY_VIEW permission was requested for non " +
                            "existing activity.");
                    }

                    // If activity is published, return whether the user is allowed to see published activities.
                    if (activity.published) {
                        return res.role.ACTIVITY_VIEW_PUBLISHED;
                    }

                    // If not logged in and unpublished, you are not allowed to view the activity
                    if (!res.loggedIn) {
                        return false;
                    }

                    // Unpublished activities allowed to be seen by organizers.
                    // Check if user is member of the group that organizes this activity.
                    const organizing = activity.organizer.members.some(
                        function(us: User & {UserGroup: any}): boolean {
                            return us.id === res.dbUser.id;
                        });

                    // Return if member is organizing, or whether member is allowed to see all unpublished activities.
                    return organizing || res.role.ACTIVITY_VIEW_ALL_UNPUBLISHED;
                });
            case "ACTIVITY_EDIT":
                // If requested without specified scope value, throw error.
                if (scope.value === undefined) {
                    throw new Error("permissions.checkPermission: ACTIVITY_EDIT requires a scope but was not given " +
                        "one.");
                }

                // If you are not logged in, you are not allowed to edit the activity.
                if (!res.loggedIn) {
                    return new Promise(function(resolve): void {
                        resolve(false);
                    });
                }

                return Activity.findByPk(scope.value, {include: [{model: Group, include: [User]}]})
                        .then(function(activity: Activity | null): boolean {

                    // If requested for non existing activity, throw error.
                    if (activity === null) {
                        throw new Error("permissions.checkPermission: ACTIVITY_EDIT permission was requested for " +
                            "non existing activity.");
                    }

                    // Activities allowed to be edited by organizers1
                    // Check if user is member of the group that organizes this activity
                    const organizing = activity.organizer.members.some(
                        function(us: User & {UserGroup: any}): boolean {
                            return us.id === res.dbUser.id;
                        });

                    // Return if member is organizing, or whether member is allowed to manage activities.
                    return organizing || res.role.ACTIVITY_MANAGE;
                });
            default:
                if (scope.type === undefined || scope.type === null) {
                    throw new Error("permissions.checkPermission: scope.type is missing");
                }

                if ((res.role as any)[scope.type] !== undefined) {
                    return new Promise(function(resolve): void {
                        resolve((res.role as any)[scope.type]);
                    });
                } else {
                    throw new Error("permissions.checkPermission: Unknown scope type: " + scope.type);
                }
        }
    });
}

/**
 * Helper function for check function that resolves the user, role and whether the user is loggedIn from a given user
 * (User | number).
 *
 * @param user  Either a User model instance, a number representing the user id, or null representing
 *                  'not logged in user'.
 */
export function resolveUserAndRole(user: User | number): Promise<{ dbUser: User, role: Role, loggedIn: boolean}> {
    return new Promise(function(resolve, reject): any {
        if (!user) {

            // Find role associated to 'not logged in' user.
            Role.findOne({
                where: {
                    name: 'Not logged in'
                }
            }).then(function(role: Role): any {
                // If no role associated, throw error as this should always exist.
                if (role === null) {
                    throw new Error("Permissions.check: 'Not logged in' role could not be found. " +
                        "Be sure to have a correctly initialized database");
                }

                resolve({dbUser: null, role: role, loggedIn: false});
            });
        } else if (typeof user === 'number') {
            // If user is a number, then find the User model instance associated to it.
            return User.findByPk(user).then(function(dbUser: User | null): any {

                // If no user associated, reject promise
                if (dbUser === null) {
                    reject("permissions.resolveUserAndRole: user could not be resolved");
                } else {
                    // If user associated, then find role associated to user.
                    return Role.findByPk(dbUser.roleId).then(function(role: Role): any {

                        // Because of db constraints, role must exist, no need for error checking.
                        resolve({dbUser: dbUser, role: role, loggedIn: true});
                    });
                }
            });
        } else {
            // If user is a User model instance, then find the associated role.
            return Role.findByPk(user.roleId).then(function(role: Role): any {
                resolve({dbUser: user, role: role, loggedIn: true});
            });
        }
    });
}

/**
 * Checks whether all given scopes (permissions) are adhered to, and returns it as middleware.
 *
 * @param scopes    Scopes to check
 */
export function requireAllPermissions(scopes: [ {type: string, value?: number} ]): any {

    return function(req: Request, res: Response, next: any): any {
        const user = res.locals.session ? res.locals.session.userId : null;
        const promises = scopes.map(function(scope: { type: string, value?: number }): Promise<boolean> {
            return checkPermission(user, scope);
        });
        all(promises).then(function(result: any): any {
            if (!result) {
                return res.sendStatus(403);
            }
            return next();
        }).catch(function(err: Error): void {
            next(err);
        }).done();
    };
}

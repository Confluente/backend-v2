import {all} from "bluebird";
import {Request, Response} from "express";

import {User} from "./models/database/user.model";
import {Group} from "./models/database/group.model";
import {Activity} from "./models/database/activity.model";
import {Role} from "./models/database/role.model";

/**
 * Checks whether user has required permissions for a given scope
 * @param user          User to check permissions for. Either database object or user ID.
 * @param scope         Type of permission requested.
 * @returns boolean
 */
export function check(user: User | number, scope: any): Promise<boolean> {
    return resolveUserAndRole(user)
            .then(function(res: {dbUser: User, role: Role, loggedIn: boolean}): Promise<boolean> | boolean {

        // Determine rule based on context
        switch (scope.type) {
            case "PAGE_VIEW":
                return res.role.PAGE_VIEW;
            case "PAGE_MANAGE":
                return res.role.PAGE_MANAGE;
            case "USER_CREATE":
                return res.role.USER_CREATE;
            case "USER_VIEW":
                return User.findByPk(scope.value).then(function(user_considered: User): boolean {
                    if (!user_considered) {
                        return false;
                    }
                    // Users can view their own account
                    const ownAccount: boolean = (res.dbUser.id === user_considered.id);
                    return ownAccount || res.role.USER_VIEW_ALL;
                });
            case "USER_MANAGE":
                return res.role.USER_MANAGE;
            case "CHANGE_PASSWORD":
                return User.findByPk(scope.value).then(function(user_considered: User): boolean {
                    if (!user_considered) {
                        return false;
                    }
                    // Users can change their own password
                    const ownAccount = (res.dbUser.id === user_considered.id);
                    return ownAccount || res.role.CHANGE_ALL_PASSWORDS;
                });
            case "GROUP_VIEW":
                return res.role.GROUP_VIEW;
            case "GROUP_MANAGE":
                return res.role.GROUP_MANAGE;
            case "GROUP_ORGANIZE":
                if (!res.loggedIn) {
                    return false;
                }
                return Group.findByPk(scope.value).then(function(group: Group): boolean {
                    // Check whether group is allowed to organize
                    if (!group.canOrganize) {
                        return false;
                    }
                    // If the group is allowed to organize, members are allowed to organize
                    const member = res.dbUser.groups.some(
                        function(dbGroup: Group & {UserGroup: any}): boolean {
                            return dbGroup.id === group.id;
                        });
                    return member || res.role.GROUP_ORGANIZE_WITH_ALL;
                });
            case "ACTIVITY_VIEW":
                return Activity.findByPk(scope.value).then(function(activity: Activity): boolean {
                    if (!activity) {
                        return false;
                    }
                    if (activity.published) {
                        return res.role.ACTIVITY_VIEW_PUBLISHED;
                    }
                    // Unpublished activities allowed to be seen by organizers
                    // const organizing = loggedIn ? dbUser.hasGroup(activity.OrganizerId) : false;
                    const organizing = res.loggedIn ? res.dbUser.groups.some(
                        function(dbGroup: Group & {UserGroup: any}): boolean {
                            return dbGroup.id === activity.organizer.id;
                    }) : false;
                    return organizing || res.role.ACTIVITY_VIEW_ALL_UNPUBLISHED;
                });
            case "ACTIVITY_EDIT":
                return Activity.findByPk(scope.value).then(function(activity: Activity): boolean {
                    // Activities allowed to be edited by organizers
                    const organizing = res.loggedIn ? res.dbUser.groups.some(
                        function(dbGroup: Group & {UserGroup: any}): boolean {
                            return dbGroup.id === activity.organizer.id;
                        })  : false;
                    return organizing || res.role.ACTIVITY_MANAGE;
                });
            default:
                throw new Error("Unknown scope type");
        }
    });
}

/**
 * Helper function for check function that resolves the user, role and whether the user is loggedIn from a given user
 * (User | number).
 *
 * @param user  Either a User model instance or a number.
 */
export function resolveUserAndRole(user: User | number): Promise<{ dbUser: User, role: Role, loggedIn: boolean}> {
    return new Promise(function(resolve, reject): any {
        let loggedIn = true;
        if (!user) {

            // User undefined
            loggedIn = false;

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

                resolve({dbUser: null, role: role, loggedIn: loggedIn});
            });
        } else if (typeof user === 'number') {
            // If user is a number, then find the User model instance associated to it.
            return User.findByPk(user).then(function(dbUser: User | null): any {

                // If no user associated, reject promise
                if (dbUser === null) {
                    reject("permissions.resolveUserAndRole: user could not be resolved");
                }

                // If user associated, then find role associated to user.
                return Role.findByPk(dbUser.roleId).then(function(role: Role): any {

                    // Because of db constraints, role must exist, no need for error checking.
                    resolve({dbUser: dbUser, role: role, loggedIn: loggedIn});
                });
            });
        } else {
            // If user is a User model instance, then find the associated role.
            return Role.findByPk(user.roleId).then(function(role: Role): any {
                resolve({dbUser: user, role: role, loggedIn: loggedIn});
            });
        }
    });
}

/**
 * Checks whether all given scopes (permissions) are adhered to, and returns it as middleware.
 *
 * @param scopes    Scopes to check
 */
export function requireAll(scopes: any): any {
    if (!scopes.length) {
        scopes = [scopes];
    }

    return function(req: Request, res: Response, next: any): any {
        const user = res.locals.session ? res.locals.session.user : null;
        const promises = scopes.map(function(scope: string): Promise<boolean> {
            return check(user, scope);
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

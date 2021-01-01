import {Promise, all} from "q";
import {Request, Response} from "express";

import {User} from "./models/user";
import {Group} from "./models/group";
import {Activity} from "./models/activity";
import {Role} from "./models/role";

/**
 * Checks whether user has required permissions for a given scope
 * @param user          User to check permissions for. Either database object or user ID.
 * @param scope         Type of permission requested.
 * @returns boolean
 */
export function check(user: User | number, scope: any): Promise<boolean> {
    let loggedIn = true;
    return Promise(function(resolve, reject): any {
        if (!user) {
            // User undefined
            loggedIn = false;
            resolve();
        } else if (typeof user === 'number') {
            resolve(User.findByPk(user));
        } else {
            resolve(user);
        }
    }).then(function(dbUser: User): boolean {
        if (!loggedIn) {
            dbUser.role = Role.findOne({where: {
                name: 'Not logged in'
            }});
        }

        // Determine rule based on context
        switch (scope.type) {
            case "PAGE_VIEW":
                return dbUser.role.PAGE_VIEW;
            case "PAGE_MANAGE":
                return dbUser.role.PAGE_MANAGE;
            case "USER_CREATE":
                return dbUser.role.USER_CREATE;
            case "USER_VIEW":
                return User.findByPk(scope.value).then(function(user_considered: User): boolean {
                    if (!user_considered) {
                        return false;
                    }
                    // Users can view their own account
                    const ownAccount: boolean = (dbUser.id === user_considered.id);
                    return ownAccount || dbUser.role.USER_VIEW_ALL;
                });
            case "USER_MANAGE":
                return dbUser.role.permissions.USER_MANAGE;
            case "CHANGE_PASSWORD":
                return User.findByPk(scope.value).then(function(user_considered: User): boolean {
                    if (!user_considered) {
                        return false;
                    }
                    // Users can change their own password
                    const ownAccount = (dbUser.id === user_considered.id);
                    return ownAccount || dbUser.role.CHANGE_ALL_PASSWORDS;
                });
            case "GROUP_VIEW":
                return dbUser.role.GROUP_VIEW;
            case "GROUP_MANAGE":
                return dbUser.role.GROUP_MANAGE;
            case "GROUP_ORGANIZE":
                if (!loggedIn) { return false; }
                return Group.findByPk(scope.value).then(function(group: Group): boolean {
                    // Check whether group is allowed to organize
                    if (!group.canOrganize) { return false; }
                    // If the group is allowed to organize, members are allowed to organize
                    const member = dbUser.hasGroup(group.id);
                    return member || dbUser.role.GROUP_ORGANIZE_WITH_ALL;
                });
            case "ACTIVITY_VIEW":
                return Activity.findByPk(scope.value).then(function(activity: Activity): boolean {
                    if (!activity) {
                        return false;
                    }
                    if (activity.published) {
                        return dbUser.role.ACTIVITY_VIEW_PUBLISHED;
                    }
                    // Unpublished activities allowed to be seen by organizers
                    const organizing = loggedIn ? dbUser.hasGroup(activity.OrganizerId) : false;
                    return organizing || dbUser.role.ACTIVITY_VIEW_ALL_UNPUBLISHED;
                });
            case "ACTIVITY_EDIT":
                return Activity.findByPk(scope.value).then(function(activity: Activity): boolean {
                    // Activities allowed to be edited by organizers
                    const organizing = loggedIn ? dbUser.hasGroup(activity.OrganizerId) : false;
                    return organizing || dbUser.role.ACTIVITY_MANAGE;
                });
            default:
                throw new Error("Unknown scope type");
        }
    });
}

export function allPromises(promises: Promise<any>[]): any {
    return all(promises).then(function(results: any): any {
        return results.every(function(e: any): any {
            return e;
        });
    });
}


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
        }).fail(function(err: Error): void {
            next(err);
        }).done();
    };
}

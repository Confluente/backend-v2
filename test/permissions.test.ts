import {TestFactory} from "./testFactory";
import {User} from "../src/models/database/user.model";
import {boardMember} from "./test.data";
import {check, resolveUserAndRole} from "../src/permissions";
import {Role} from "../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

describe("activity.route.ts '/api/activities'", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init(true);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    describe("resolveUserAndRole", () => {

        it("Standard functionality when given a User model instance", (done) => {
            User.findByPk(boardMember.id).then(function(user: User): void {
                resolveUserAndRole(user).then(function(res: { dbUser: User, role: Role, loggedIn: boolean }): void {
                    if ((res.dbUser.id !== boardMember.id) ||
                        (res.role.name !== "Board member") ||
                        (res.loggedIn !== true)) {
                        done(new Error());
                    } else {
                        done();
                    }
                });
            });
        });

        it("Standard functionality when given a number", (done) => {
            resolveUserAndRole(boardMember.id)
                    .then(function(res: { dbUser: User, role: Role, loggedIn: boolean }): void {
                if ((res.dbUser.id !== boardMember.id) ||
                    (res.role.name !== "Board member") ||
                    (res.loggedIn !== true)) {
                    done(new Error());
                } else {
                    done();
                }
            });
        });

        it("Standard functionality when given nothing", (done) => {
            resolveUserAndRole(null)
                    .then(function(res: { dbUser: User, role: Role, loggedIn: boolean }): void {
                if ((res.dbUser !== null) ||
                    (res.role.name !== "Not logged in") ||
                    (res.loggedIn !== false)) {
                    done(new Error());
                } else {
                    done();
                }
            });
        });

        it("Check error throwing on non existent user number", (done) => {
            resolveUserAndRole(10)
                .then(function(_: any): void {
                    done(new Error());
                }).catch(function(err): void {
                    if (err === "permissions.resolveUserAndRole: user could not be resolved") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
        });
    });

    describe("check", () => {
        
        it("Check standard role case (where the case simply returns the role boolean)", (done) => {
            
            // Result of this should be equal to the PAGE_VIEW permission of the "Not logged in" 
            check(null, {type: "PAGE_VIEW"}).then(function(permission: boolean): void {
                if (permission) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("Check if users can only see their own account if they do not have the USER_VIEW_ALL permission", (done) => {
            check(2, { type: "USER_VIEW", value: 3}).then(function(permission: boolean): void {
                // Should not have the permission to view user 3
                if (!permission) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

    });
});

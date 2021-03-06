import {TestFactory} from "./testFactory";
import {User} from "../src/models/database/user.model";
import {boardMember} from "./test.data";
import {checkPermission, resolveUserAndRole} from "../src/permissions";
import {Role} from "../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

describe("permissions.ts", () => {

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
            checkPermission(null, {type: "PAGE_VIEW"}).then(function(permission: boolean): void {
                if (permission) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("Check unknown permission returning error", (done) => {
            checkPermission(null, { type: "UNKNOWN_PERMISSION_THINGY" }).then(function(_: boolean): void {
                done(new Error());
            }).catch(function(err: Error): void {
                if (err.message === "permissions.checkPermission: Unknown scope type: UNKNOWN_PERMISSION_THINGY") {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("Should throw error when scope type is null", (done) => {
            checkPermission(null, { type: null }).then(function(_: boolean): void {
                done(new Error());
            }).catch(function(err: Error): void {
                if (err.message === "permissions.checkPermission: scope.type is missing") {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        describe("USER_VIEW", () => {

            it("Check standard functionality", (done) => {
                checkPermission(4, { type: "USER_VIEW", value: 4 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Check if users can only see their own account " +
                    "if they do not have the USER_VIEW_ALL permission", (done) => {
                checkPermission(2, { type: "USER_VIEW", value: 3 }).then(function(permission: boolean): void {
                    // Should not have the permission to view user 3
                    if (!permission) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("USER_VIEW should throw error when requested for non existing user", (done) => {
                checkPermission(1, {type: "USER_VIEW", value: 10 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: USER_VIEW permission was requested for non " +
                        "existing user.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("USER_VIEW should throw error when requested without scope value", (done) => {
                checkPermission(1, { type: "USER_VIEW" }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: USER_VIEW requires a scope value but was not given " +
                        "one") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("USER_VIEW should throw error when requested without source user", (done) => {
                checkPermission(null, { type: "USER_VIEW", value: 2 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: USER_VIEW requires a user for which the request is" +
                        " made, but non was given") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });
        });

        describe("CHANGE_PASSWORD", () => {

            it("User should be able to change their own password", (done) => {
                checkPermission(6, { type: "CHANGE_PASSWORD", value: 6 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("No one, except super admins, should be able to change other peoples passwords", (done) => {
                checkPermission(2, { type: "CHANGE_PASSWORD", value: 4 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Super admins should be able to change other people passwords", (done) => {
                checkPermission(1, { type: "CHANGE_PASSWORD", value: 4 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Change password permission request for non existing user should throw an error", (done) => {
                checkPermission(1, { type: "CHANGE_PASSWORD", value: 10 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: Change password was requested for non existing user") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("CHANGE_PASSWORD should throw error if no scope value is passed", (done) => {
                checkPermission(1, { type: "CHANGE_PASSWORD" }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: CHANGE_PASSWORD requires a scope value but was " +
                        "not given one.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("CHANGE_PASSWORD should throw error if no user is passed", (done) => {
                checkPermission(null, { type: "CHANGE_PASSWORD", value: 2 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: CHANGE_PASSWORD requires a user for which the " +
                        "request is made, but non was given.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

        });

        describe("GROUP_ORGANIZE", () => {

            it("GROUP_ORGANIZE should always be false if not logged in", (done) => {
                checkPermission(null, { type: "GROUP_ORGANIZE", value: 100 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("GROUP_ORGANIZE should be true if member is part of group that is allowed to organize", (done) => {
                checkPermission(4, { type: "GROUP_ORGANIZE", value: 1 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("GROUP_ORGANIZE should be false if group is not allowed to organize", (done) => {
                checkPermission(4, { type: "GROUP_ORGANIZE", value: 2 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("GROUP_ORGANIZE should be true if member is allowed to organize with all groups", (done) => {
                checkPermission(3, { type: "GROUP_ORGANIZE", value: 2 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("GROUP_ORGANIZE should throw error if requested for non existing group", (done) => {
                checkPermission(1, { type: "GROUP_ORGANIZE", value: 100 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permission.checkPermission: GROUP_ORGANIZE permission requested for non " +
                        "existing group. scope.value: 100") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("GROUP_ORGANIZE should throw error if scope value is not submitted", (done) => {
                checkPermission(1, { type: "GROUP_ORGANIZE" }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permission.checkPermission: GROUP_ORGANIZE requires a scope value but was " +
                        "not given one.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

        });

        describe("ACTIVITY_VIEW", () => {

            it("ACTIVITY_VIEW should throw error if requested without specified scope value", (done) => {
                checkPermission(1, { type: "ACTIVITY_VIEW" }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: ACTIVITY_VIEW requires a scope value but was " +
                        "not given one.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should return true if activity is published", (done) => {
                checkPermission(null, { type: "ACTIVITY_VIEW", value: 2 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should return false for unpublished activities when user is not logged in", (done) => {
                checkPermission(null, { type: "ACTIVITY_VIEW", value: 1 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should return true for unpublished activities " +
                "when user is organizing the act", (done) => {
                checkPermission(4, { type: "ACTIVITY_VIEW", value: 1 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should return false for unpublished activity when user is not organizing " +
                "the activity", (done) => {
                checkPermission(5, { type: "ACTIVITY_VIEW", value: 1 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should return true if user is allowed to see all unpublished activities", (done) => {
                checkPermission(1, { type: "ACTIVITY_VIEW", value: 1 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("ACTIVITY_VIEW should throw error if requested for non existing activity", (done) => {
                checkPermission(1, { type: "ACTIVITY_VIEW", value: 100 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: ACTIVITY_VIEW permission was requested for non " +
                        "existing activity.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

        });

        describe("ACTIVITY_EDIT", () => {

            it("Should throw error when scope value is undefined", (done) => {
                checkPermission(1, { type: "ACTIVITY_EDIT" }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: ACTIVITY_EDIT requires a scope but was not " +
                        "given one.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Should return false if not logged in", (done) => {
                checkPermission(null, { type: "ACTIVITY_EDIT", value: 2 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Should throw error if requested for non existing activity", (done) => {
                checkPermission(1, { type: "ACTIVITY_EDIT", value: 100 }).then(function(_: boolean): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "permissions.checkPermission: ACTIVITY_EDIT permission was requested for " +
                        "non existing activity.") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Should return false if member is not in organizing group", (done) => {
                checkPermission(5, { type: "ACTIVITY_EDIT", value: 1 }).then(function(res: boolean): void {
                    if (!res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Should return true if member is in organizing group", (done) => {
                checkPermission(4, { type: "ACTIVITY_EDIT", value: 1 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

            it("Should return true if user has activity manage rights", (done) => {
                checkPermission(3, { type: "ACTIVITY_EDIT", value: 1 }).then(function(res: boolean): void {
                    if (res) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });

        });
    });
});

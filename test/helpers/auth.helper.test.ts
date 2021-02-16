import {
    authenticate,
    generateSalt,
    getPasswordHash,
    getPasswordHashSync,
    startSession
} from "../../src/helpers/auth.helper";
import { expect, assert } from "chai";
import {User} from "../../src/models/database/user.model";
import {roleSuperAdmin, superAdmin} from "../test.data";
import {TestFactory} from "../testFactory";
import {Role} from "../../src/models/database/role.model";
import {cleanRoles, cleanSessions, cleanUsers} from "../test.helper";
import {Session} from "../../src/models/database/session.model";

const factory: TestFactory = new TestFactory();

describe("auth.helper.ts", () => {

    describe("getPasswordHash", () => {

        it("basic case", (done) => {
            const password = "s;lksdjf;lskdjf";
            const salt = "hahahaha";

            getPasswordHash(password, salt).then(function(buf: Buffer): void {
                if (JSON.stringify(buf) === "{\"type\":\"Buffer\",\"data\":[194,197,197,246,41,95,99,5,244,27,127,208,174,248,245,127,108,78,130,5,133,162,44,186,122,80,64,135,153,128,91,67]}") {
                    done();
                } else {
                    console.log(JSON.stringify(buf));
                    done(new Error("Did not generate correct password hash!"));
                }
            });
        });

        it("salt === null", () => {
            const password = "superduperpass";
            const salt: string = null;

            expect(() => {
                getPasswordHash(password, salt);
            }).to.throw("auth.helper.getPasswordHash: salt was null.");
        });

        it("password === null", () => {
            const password: string = null;
            const salt = "supersalt";

            expect(() => {
                getPasswordHash(password, salt);
            }).to.throw("auth.helper.getPasswordHash: password was null.");
        });
    });

    describe("generateSalt", () => {

        it("checks basic case", () => {
            const length = 32;

            assert.equal(generateSalt(length).length, length);
        });

        it("check for negative length", () => {
            const length = -1;

            expect(() => {
                generateSalt(length);
            }).to.throw("auth.helper.generateSalt: length had negative value -1.");
        });

        it("checks for length of 0", () => {
            const length = 0;

            assert.equal(generateSalt(length), "");
        });
    });

    describe("getPasswordHashSync", () => {

        it("basic case", (done) => {
            const password = "s;lksdjf;lskdjf";
            const salt = "hahahaha";

            if (JSON.stringify(JSON.stringify(getPasswordHashSync(password, salt)) === "{\"type\":\"Buffer\",\"data\":[139,64,166,79,252,104,200,22,235,33,149,53,1,154,118,206,253,158,195,173,218,201,103,53,95,84,121,45,133,20,161,173]}")) {
                done();
            } else {
                done(new Error("Did not generate correct password hash!"));
            }
        });

        it("salt === null", () => {
            const password = "superduperpass";
            const salt: string = null;

            expect(() => {
                getPasswordHashSync(password, salt);
            }).to.throw("auth.helper.getPasswordHashSync: salt was null.");
        });

        it("password === null", () => {
            const password: string = null;
            const salt = "supersalt";

            expect(() => {
                getPasswordHashSync(password, salt);
            }).to.throw("auth.helper.getPasswordHashSync: password was null.");
        });
    });

    describe("authenticate", () => {

        before(async () => {
            await factory.init();
            await Role.create(roleSuperAdmin);
        });

        after(async () => {
            await factory.close();
            cleanRoles();
        });

        it("checks basic case", (done) => {
            const new_user = {...superAdmin};

            User.create(new_user).then(function(dbUser: User): void {
                authenticate(new_user.email, "HonoursWorthyPassword").then(function(auth_user: User): void {
                    cleanUsers();
                    if (auth_user.id === dbUser.id && auth_user.email === dbUser.email) {
                        done();
                    } else {
                        done(new Error("Authenticate successful, but not correct(?)"));
                    }
                }).catch(function(_: Error): void {
                    cleanUsers();
                    done(new Error());
                });
            });
        });

        it("checks basic failing case", (done) => {
            const new_user = {...superAdmin};

            User.create(new_user).then(function(dbUser: User): void {
                authenticate(new_user.email, "IncorrectPassword").then(function(auth_user: User): void {
                    cleanUsers();
                    done(new Error("Authentication successful with incorrect password"));
                }).catch(function(err: Error): void {
                    cleanUsers();
                    if (err.message === "Password incorrect") {
                        done();
                    } else {
                        done(new Error("Could not authenticate for wrong reason"));
                    }
                });
            });
        });

        it("checks for unknown email case", (done) => {
            authenticate("unknown@email", "somepassword").then(function(auth_user: User): void {
                done(new Error("Authenticated nonexisting user"));
            }).catch(function(err: Error): void {
                if (err.message === "Email address unknown@email not associated to any account.") {
                    done();
                } else {
                    done(new Error("Could not authenticate for wrong reason"));
                }
            });
        });
    });

    describe("startSession", () => {

        before(async () => {
            await factory.init();
            await Role.create(roleSuperAdmin);
        });

        after(async () => {
            await factory.close();
        });

        it("basic case", (done) => {
            User.create(superAdmin).then(function(dbUser: User): void {
                startSession(dbUser.id, "coolIPAddress").then(function(session: Session): void {
                    User.findByPk(dbUser.id, {include: [Session]}).then(function(updatedUser: User): void {
                        cleanSessions();
                        if (updatedUser.session.token.equals(session.token)) {
                            done();
                        } else {
                            done(new Error("Tokens dont match up"));
                        }
                    });
                }).catch(function(err: Error): void {
                    cleanSessions();
                    done(new Error("Failed to make session"));
                });
            });
        });

        it("Starting session for unknown userId", (done) => {
            startSession(3, "coolIPAddress").then(function(session: Session): void {
                cleanSessions();
                done(new Error("Could create session for non existing user"));
            }).catch(function(err: Error): void {
                cleanSessions();
                if (err.name === "SequelizeForeignKeyConstraintError") {
                    done();
                } else {
                    done(new Error("Could not create session, but for the wrong reason"));
                }
            });
        });

        it("If IP is empty string", () => {
            expect(() => {
                startSession(1, "");
            }).to.throw("auth.helper.startSession: IP was empty.");
        });

        it("If IP is null", () => {
            expect(() => {
                startSession(1, null);
            }).to.throw("auth.helper.startSession: IP was null.");
        });
    });
});

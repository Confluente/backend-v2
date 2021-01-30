import {authenticate, generateSalt, getPasswordHash, getPasswordHashSync} from "../../src/helpers/auth.helper";
import { expect, assert } from "chai";
import {User} from "../../src/models/database/user.model";
import {role, user} from "../test.data";
import {TestFactory} from "../testFactory";
import {Role} from "../../src/models/database/role.model";

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
            await Role.create(role);
        });

        after(async () => {
            await factory.close();
        });

        it("checks basic case", (done) => {
            const new_user = {...user};

            User.create(new_user).then(function(dbUser: User): void {
                authenticate(new_user.email, "HonoursWorthyPassword").then(function(auth_user: User): void {
                    if (auth_user.id === dbUser.id && auth_user.email === dbUser.email) {
                        done();
                    } else {
                        done(new Error("Authenticate successful, but not correct(?)"));
                    }
                }).catch(function(_: Error): void {
                    done(new Error());
                });
            });
        });
    });

    describe("startSession", () => {

    });
});

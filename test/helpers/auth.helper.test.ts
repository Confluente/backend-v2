import {generateSalt, getPasswordHash} from "../../src/helpers/auth.helper";
import { expect, assert } from "chai";
import exp = require("constants");

describe("auth.helper.ts", () => {

    describe("getPasswordHash", () => {

        it("basic case", (done) => {
            const password = "s;lksdjf;lskdjf";
            const salt = "hahahaha";

            getPasswordHash(password, salt).then(function(buf: Buffer): void {
                if (JSON.stringify(buf) === "{\"type\":\"Buffer\",\"data\":[139,64,166,79,252,104,200,22,235,33,149,53,1,154,118,206,253,158,195,173,218,201,103,53,95,84,121,45,133,20,161,173]}") {
                    done();
                } else {
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

    });

    describe("authenticate", () => {

    });

    describe("startSession", () => {

    });
});

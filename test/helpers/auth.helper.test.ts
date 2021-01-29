import {getPasswordHash} from "../../src/helpers/auth.helper";
import { expect } from "chai";

describe("auth.helper.ts", () => {

    describe("getPasswordHash", () => {

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
            }).to.throw("auth.helper.getPasswordHash: password was null.")
        });
    });

    describe("generateSalt", () => {

    });

    describe("getPasswordHashSync", () => {

    });

    describe("authenticate", () => {

    });

    describe("startSession", () => {

    });
});

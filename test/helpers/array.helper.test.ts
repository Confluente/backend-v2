import {expect, assert} from "chai";
import {describe, it} from "mocha";

import {destringifyStringifiedArrayOfStrings, stringifyArrayOfStrings} from "../../src/helpers/array.helper";

describe("array.helper.test.ts", () => {

    describe("stringifyArrayOfStrings", () => {

        it("checks basic case", () => {
            const arrayToStringify = ['heyo', 'hello'];
            assert.strictEqual(stringifyArrayOfStrings(arrayToStringify), 'heyo#,#hello');
        });

        it("array with one item should just return string of one item", () => {
            const arrayToStringify = ['hey'];
            assert.strictEqual(stringifyArrayOfStrings(arrayToStringify), 'hey');
        });

        it("checks exception case", () => {
            const arrayToStringify = ['he#,#llo'];
            expect(() => {
                stringifyArrayOfStrings(arrayToStringify);
            }).to.throw('array.helper.' +
                'stringifyArrayOfStrings: item 0 contains #,# (is he#,#llo) and can therefore not be stringified');
        });
    });

    describe("destringifyStringifiedArrayOfStrings", () => {

        it("checks basic case", () => {
            const stringToDestringify = "hey#,#hello";
            assert.deepEqual(destringifyStringifiedArrayOfStrings(stringToDestringify), ["hey", "hello"]);
        });

        it("one item string should return list with one item", () => {
            const stringToDestringify = "hey";
            assert.deepEqual(destringifyStringifiedArrayOfStrings(stringToDestringify), ["hey"]);
        });

        it("Empty string case", () => {
            const stringToDestringify = "";
            assert.deepEqual(destringifyStringifiedArrayOfStrings(stringToDestringify), []);
        });

        it("Passing null", () => {
            const stringToDestringify: string = null;
            expect(() => {
                destringifyStringifiedArrayOfStrings(stringToDestringify)
            }).to.throw("array.helper.destringifyStringifiedArrayofString: input_string was null");
        });
    });
});

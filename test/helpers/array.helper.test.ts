import {expect, assert} from "chai";
import {describe, it} from "mocha";

import {
    destringifyStringifiedArrayOfNumbers,
    destringifyStringifiedArrayOfStrings,
    stringifyArrayOfNumbers,
    stringifyArrayOfStrings
} from "../../src/helpers/array.helper";

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

        it("checks empty array case", () => {
            const arrayToStringify: string[] = [];
            assert.strictEqual(stringifyArrayOfStrings(arrayToStringify), "");
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

    describe("stringifyArrayOfNumbers", () => {

        it("checks basic case", () => {
            const arrayToStringify = [1, 2];
            assert.strictEqual(stringifyArrayOfNumbers(arrayToStringify), "1#,#2");
        });

        it("array with one item should just return string of one item", () => {
            const arrayToStringify = [1];
            assert.strictEqual(stringifyArrayOfNumbers(arrayToStringify), '1');
        });

        it("checks empty array case", () => {
            const arrayToStringify: number[] = [];
            assert.strictEqual(stringifyArrayOfNumbers(arrayToStringify), "");
        });
    });

    describe("destringifyStringifiedArrayOfNumber", () => {

        it("checks basic case", () => {
            const stringToDestringify = "1#,#2";
            assert.deepEqual(destringifyStringifiedArrayOfNumbers(stringToDestringify), [1, 2]);
        });

        it("one item string should return list with one item", () => {
            const stringToDestringify = "1";
            assert.deepEqual(destringifyStringifiedArrayOfNumbers(stringToDestringify), [1]);
        });

        it("Empty string case", () => {
            const stringToDestringify = "";
            assert.deepEqual(destringifyStringifiedArrayOfNumbers(stringToDestringify), []);
        });

        it("Passing null", () => {
            const stringToDestringify: string = null;
            expect(() => {
                destringifyStringifiedArrayOfNumbers(stringToDestringify);
            }).to.throw("array.helper.destringifyStringifiedArrayofNumbers: input_string was null");
        });
    });
});

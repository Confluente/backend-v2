import {expect, assert} from "chai";
import {describe} from "mocha";

import {stringifyArrayOfStrings} from "../../src/helpers/arrayHelper";

describe("arrayHelper", () => {

    describe("#stringifyArrayOfStrings", () => {

        it("checks basic case", () => {
            const arrayToStringify = ['heyo', 'hello'];
            assert.strictEqual(stringifyArrayOfStrings(arrayToStringify), 'heyo#,#hello');
        });

        it("checks exception case", () => {
            const arrayToStringify = ['he#,#llo'];
            expect(() => {
                stringifyArrayOfStrings(arrayToStringify);
            }).to.throw('ArrayHelper.' +
                'stringifyArrayOfStrings: item 0 contains #,# (is he#,#llo) and can therefore not be stringified');
        });
    });
});

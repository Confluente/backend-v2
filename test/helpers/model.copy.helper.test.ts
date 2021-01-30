import {copyMatchingSourceKeyValues} from "../../src/helpers/model.copy.helper";

describe("model.copy.helper.ts", () => {

    describe("copyMatchingSourceKeyValues", () => {

        it("checks basic case", (done) => {
            class TestClass {
                key1: string = "hi";
                key2: number = 0;
                key3: boolean = true;
            }

            class SecondClass {
                key1: string = "no";
                key2: number = 2;
                key3: string = "he";
            }

            const obj_1 = new TestClass();
            let obj_2 = new SecondClass();

            obj_2 = copyMatchingSourceKeyValues(obj_2, obj_1);

            if (obj_2.key1 === "hi" && obj_2.key2 === 0 && obj_2.key3 === "he") {
                done();
            } else {
                done(new Error("Something went wrong with copying"));
            }
        });
    });
});

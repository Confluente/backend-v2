import {copyMatchingSourceKeyValues} from "../../src/helpers/web.model.copy.helper";
import {GroupWeb} from "../../src/models/web/group.web.model";
import {UserGroupWeb} from "../../src/models/web/usergroup.web.model";
import {UserWeb} from "../../src/models/web/user.web.model";

describe("web.model.copy.helper.ts", () => {

    describe("copyMatchingSourceKeyValues", () => {

        it("checks basic case", (done) => {
            const obj_1 = new GroupWeb();
            obj_1.id = 2;
            obj_1.description = "heyyy";
            obj_1.members = [new UserGroupWeb(new UserWeb(), obj_1, "func")];

            const obj_2 = copyMatchingSourceKeyValues(new GroupWeb(), obj_1);

            if (obj_2.id === 2 && obj_2.description === "heyyy" && !obj_2.hasOwnProperty('members')) {
                done();
            } else {
                done(new Error("Something went wrong with copying"));
            }
        });
    });
});

import {TestFactory} from "../testFactory";
import {Group} from "../../src/models/database/group.model";
import {organizingGroup} from "../test.data";
import {assert} from "chai";

const factory: TestFactory = new TestFactory();

describe("group.model.ts", () => {

    before(async () => {
        await factory.init();
    });

    after(async () => {
        await factory.close();
    });

    it("Adding a valid group instance", () => {
        Group.create(organizingGroup).then(function(group: Group): void {
            assert(true);
        }).catch(function(result: any): void {
            assert.fail();
        });
    });
});

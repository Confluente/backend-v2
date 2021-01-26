import {Activity} from "../../src/models/database/activity.model";
import {unpublishedActivity} from "../test.data";
import {cleanActivities} from "../helpers/test.helper";
import {assert} from "chai";
import {TestFactory} from "../testFactory";

const factory: TestFactory = new TestFactory();

describe("activity.model.ts", () => {

    before(async () => {
        await factory.init();
    });

    after(async () => {
        await factory.close();
    });

    it("Adding a valid instance", () => {
        Activity.create(unpublishedActivity).then(function(act: Activity): void {
            Activity.findByPk(act.id).then(function(dbAct: Activity): void {
                assert(act.id === dbAct.id);
            }).then(() => {
                cleanActivities().then(() => {
                    Activity.findByPk(act.id).then(function(result: any): void {
                        assert(result === null);
                    });
                });
            });
        });
    });
});

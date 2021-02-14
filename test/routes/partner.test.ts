import {TestFactory} from "../testFactory";
import {initTestData, role} from "../test.data";
import {cleanDb} from "../test.helper";

const factory: TestFactory = new TestFactory();

describe("partner.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
        await initTestData();
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await cleanDb();
        await factory.close();
    });

    it("some test", () => {
        console.log("done");
    });
});

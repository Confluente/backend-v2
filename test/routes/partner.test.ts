import {TestFactory} from "../testFactory";
import {cleanDb} from "../test.helper";

const factory: TestFactory = new TestFactory();

describe("partner.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await cleanDb();
        await factory.close();
    });
});

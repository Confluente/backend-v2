import {TestFactory} from "../testFactory";

const factory: TestFactory = new TestFactory();

describe("group.route.ts '/api/group'", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init(true);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });
});

import {TestFactory} from "../testFactory";

const factory: TestFactory = new TestFactory();

describe("notification.route.ts '/api/notifications", () => {

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

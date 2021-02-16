import {TestFactory} from "../testFactory";
const factory: TestFactory = new TestFactory();

describe("partner.route.ts '/api/partners'", () => {

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
        await factory.close();
    });

    describe("/", () => {

        describe("get", () => {
            
        });
    });
});

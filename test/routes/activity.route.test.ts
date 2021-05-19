import {TestFactory} from "../testFactory";

const factory: TestFactory = new TestFactory();

describe("activity.route.ts '/api/activities'", () => {

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

    describe("/", () => {

        describe("get", () => {

        });

        describe("post", () => {

        });

    });

    describe("/pictures/:id", () => {

        describe("post", () => {

        });

        describe("put", () => {

        });

    });

    describe("/manage", () => {

        describe("get", () => {

        });

    });

    describe("/subscriptions/:id", () => {

        describe("post", () => {

        });

        describe("delete", () => {

        });

    });

    describe("/:id", () => {

        describe("get", () => {

        });

        describe("put", () => {

        });

        describe("delete", () => {

        });

    });
});

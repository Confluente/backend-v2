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

            it("Should return all activities for logged in user", (done) => {
                factory.agents.superAdminAgent.get("/api/activities/")
                    .expect(200)
                    .then((res: any) => {
                        if (res.body.length === 2) {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return activities for no permission user", (done) => {
                factory.agents.nobodyUserAgent.get("/api/activities/")
                    .expect(200)
                    .then((res: any) => {
                        if (res.body.length === 1) {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(() => {
                    done(new Error());
                });
            });

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

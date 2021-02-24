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

    describe("/portraitRight/:id", () => {

        describe("put", () => {

            it("Should return 400 for not logged in user", (done) => {
                factory.agents.nobodyUserAgent
                    .put("/api/notifications/portraitRight/100")
                    .expect(400)
                    .then(res => {
                        if (res.body.message === "Session needs to be active for changing portrait " +
                            "right preferences.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(res => {
                        done(new Error());
                });
            });

        });

    });
});

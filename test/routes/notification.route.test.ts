import {TestFactory} from "../testFactory";
import {User} from "../../src/models/database/user.model";

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

            it("Should return 400 if requested for other users", (done) => {
                factory.agents.nonActiveMemberAgent.put("/api/notifications/portraitRight/4")
                    .expect(400)
                    .then(res => {
                        if (res.body.message === "Change of portrait right settings not allowed " +
                            "for other users.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(res => {
                        done(new Error());
                    });
            });

            it("Standard case should update user", (done) => {
                factory.agents.activeMemberAgent.put("/api/notifications/portraitRight/4")
                    .send({answer: true})
                    .then(res => {
                        User.findByPk(4).then(function(user: User): void {
                            if (user.consentWithPortraitRight) {
                                done();
                            } else {
                                done(new Error());
                            }
                        });
                    });
            });

            it("Standard case should update user (false)", (done) => {
                factory.agents.nonActiveMemberAgent.put("/api/notifications/portraitRight/5")
                    .send({answer: false})
                    .expect(200)
                    .then(res => {
                        User.findByPk(5).then(function(user: User): void {
                            if (!user.consentWithPortraitRight) {
                                done();
                            } else {
                                done(new Error());
                            }
                        });
                    });
            });

        });

    });
});

import {TestFactory} from "../testFactory";
import {Activity} from "../../src/models/database/activity.model";

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

            const unpublishedActivity = {
                id: 3,
                name: "Additonal activity!",
                description: "Wuuuuut its an activity!",
                location: "SOMEEEEWHERE UNDER THE RAINBOW",
                date: new Date(),
                startTime: "00:40",
                endTime: "00:45",
                participationFee: 8.5,
                organizerId: 1,
                published: false,
                hasCoverImage: false,
            };

            it("Should return 400 if name is not included", (done) => {
                const act = {...unpublishedActivity};
                delete act.name;

                factory.agents.superAdminAgent.post("/api/activities/")
                    .send(act)
                    .expect(400)
                    .then(() => {
                        done();
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return 400 if description is not included", (done) => {
                const act = {...unpublishedActivity};
                delete act.description;

                factory.agents.superAdminAgent.post("/api/activities/")
                    .send(act)
                    .expect(400)
                    .then(() => {
                        done();
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return 400 if date is not included", (done) => {
                const act = {...unpublishedActivity};
                delete act.date;

                factory.agents.superAdminAgent.post("/api/activities/")
                    .send(act)
                    .expect(400)
                    .then(() => {
                        done();
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return 400 if date is not parsable", (done) => {
                const act = {...unpublishedActivity};
                // @ts-ignore
                act.date = ";lkjein";

                factory.agents.superAdminAgent.post("/api/activities/")
                    .send(act)
                    .expect(400)
                    .then(() => {
                        done();
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return 400 if organizer is included", (done) => {
                const act = {...unpublishedActivity};
                delete act.organizerId;

                factory.agents.superAdminAgent.post("/api/activities/")
                    .send(act)
                    .expect(400)
                    .then(() => {
                        done();
                    }).catch(() => {
                    done(new Error());
                });
            });

            it("Should return 403 if no permission to create activity", (done) => {

                factory.agents.zeroPermissionsAgent.post("/api/activities/")
                    .send(unpublishedActivity)
                    .expect(403)
                    .then(() => {
                        done();
                    }).catch(() => {
                        done(new Error());
                    });
            });

            it("Should return 201 for correctly creating activity", (done) => {
                factory.agents.activeMemberAgent.post("/api/activities/")
                    .send(unpublishedActivity)
                    .expect(201)
                    .then((res: any) => {
                        Activity.findByPk(res.body.id).then((act: Activity) => {
                            act.destroy().then(() => {
                                done();
                            });
                        });
                    }).catch(() => {
                        done(new Error());
                    });
            });

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

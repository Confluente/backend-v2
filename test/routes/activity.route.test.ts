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

            it("Should return 401 if no session", (done) => {
                factory.agents.nobodyUserAgent.get("/api/activities/manage")
                    .expect(401)
                    .then(() => {
                        done();
                    }).catch(() => {
                    done(new Error());
                });
            });

            it("Should return all activities for super admin", (done) => {
                factory.agents.superAdminAgent.get("/api/activities/manage")
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

            it("Should return no activities for non active member", (done) => {
                factory.agents.nonActiveMemberAgent.get("/api/activities/manage")
                    .expect(200)
                    .then((res: any) => {
                        if (res.body.length === 0) {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(() => {
                        done(new Error());
                });
            });

            it("Should return all activities organized by group of active member", (done) => {
                factory.agents.activeMemberAgent.get("/api/activities/manage")
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

        });

    });

    describe("/subscriptions/:id", () => {

        describe("post", () => {

            it("Should return 401 if there is no session", (done) => {
                factory.agents.nobodyUserAgent.post("/api/activities/subscriptions/2")
                    .expect(401)
                    .then((res: any) => {
                        done();
                    }).catch(_ => {
                        done(new Error());
                });
            });

            it("Should return 400 if number of answers does not match up", (done) => {
                factory.agents.nonActiveMemberAgent.post("/api/activities/subscriptions/2")
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "The number of submitted answers does not" +
                            " correspond the number of questions in the form.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                });
            });

            it("Should return 400 for not adhering to 'required' question answers", (done) => {
                factory.agents.nonActiveMemberAgent.post("/api/activities/subscriptions/2")
                    .send(["answer1", "answer2", undefined, "something"])
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "At least one required question was " +
                            "not answered properly") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                });
            });

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

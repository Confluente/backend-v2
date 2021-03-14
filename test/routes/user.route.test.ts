import {TestFactory} from "../testFactory";

const factory: TestFactory = new TestFactory();

describe("user.route.ts '/api/users'", () => {

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

            it("Should return 403 for no permissions user", (done) => {
                factory.agents.zeroPermissionsAgent.get("/api/users/")
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "You are not authorized to manage users.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

            it("Should return all users in database if user has permission", (done) => {
                factory.agents.superAdminAgent.get("/api/users/")
                    .expect(200)
                    .then((res: any) => {
                        if (res.body.length === 6) {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: Error) => {
                        done(new Error());
                    });
            });

        });

        describe("post", () => {

        });

    });

    describe("/:id", () => {

        describe("get (and all)", () => {

            it("Should return 403 for no permissions user", (done) => {
                factory.agents.zeroPermissionsAgent.get("/api/users/5")
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "You are not authorized to view the requested user") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

            it("Should return 404 if getting non existing user", (done) => {
                // Whether user exists is checked in permissions file right now
                factory.agents.superAdminAgent.get("/api/users/100")
                    .expect(404)
                    .then((res: any) => {
                        if (res.body.message === "permissions.checkPermission: USER_VIEW permission was requested for non " +
                            "existing user.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: Error) => {
                        done(new Error());
                    });
            });

            it("Should return user if permission", (done) => {
                factory.agents.superAdminAgent.get("/api/users/2")
                    .expect(200)
                    .then((res: any) => {
                        console.log(res);
                        if (res.body.id === 2 && res.body.firstName === "Just") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((err: Error) => {
                        done(new Error());
                    });
            });

        });

    });
});

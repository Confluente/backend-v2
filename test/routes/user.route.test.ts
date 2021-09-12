import {TestFactory} from "../testFactory";
import {User} from "../../src/models/database/user.model";
import {Group} from "../../src/models/database/group.model";
import {Role} from "../../src/models/database/role.model";
import {newUser, password} from "../test.data";

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

            it("Should return 400 for not including password in request", (done) => {
                const us = {...newUser};
                delete us.password;

                factory.agents.nobodyUserAgent
                    .post("/api/users/")
                    .send(us)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "No correct password was included in the request.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 400 for including password of wrong type", (done) => {
                const us = {
                    email: "newmember@student.tue.nl",
                    displayName: "New Member",
                    firstName: "New",
                    lastName: "Member",
                    honorsMembership: "member",
                    approvingHash: "daerqecxvionsd",
                    password: true,
                    approved: false,
                    roleId: 3,
                    consentWithPortraitRight: false,
                };

                factory.agents.nobodyUserAgent
                    .post("/api/users")
                    .send(us)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "No correct password was included in the request.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });

            });

            it("Should return 400 if no email is included", (done) => {
                const us = {...newUser};
                delete us.email;

                factory.agents.nobodyUserAgent
                    .post("/api/users/")
                    .send(us)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "Not all required attributes were send in the request.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 400 if no firstname is included", (done) => {
                const us = {...newUser};
                delete us.firstName;

                factory.agents.nobodyUserAgent
                    .post("/api/users/")
                    .send(us)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "Not all required attributes were send in the request.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                    done(new Error());
                });
            });

            it("Should return 400 if no lastName is included", (done) => {
                const us = {...newUser};
                delete us.lastName;

                factory.agents.nobodyUserAgent
                    .post("/api/users/")
                    .send(us)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "Not all required attributes were send in the request.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                    done(new Error());
                });
            });

            it("Should create user properly", (done) => {
                factory.agents.nobodyUserAgent
                    .post("/api/users/")
                    .send(newUser)
                    .expect(201)
                    .then(async (res: any) => {
                        await User.findByPk(res.body.id).then(async (user: User) => {
                            await user.destroy();
                            done();
                        });
                    }).catch(_ => {
                        done(new Error());
                    });
            });
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
                    }).catch((_: Error) => {
                        done(new Error());
                    });
            });

        });

        describe("put", () => {

            it("Should return 403 if no permission", (done) => {
                factory.agents.zeroPermissionsAgent
                    .put("/api/users/6")
                    .send([{}, []])
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "You are unauthorized to edit users.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_) => {
                        done(new Error());
                    });
            });

            it("Should edit the user correctly", (done) => {
                factory.agents.superAdminAgent
                    .put("/api/users/5")
                    .send({lastName: "Ember"})
                    .expect(200)
                    .then((res: any) => {
                        User.findByPk(5, {include: [Role, Group]}).then((us: User) => {
                            if (us.id === 5 && us.lastName === "Ember") {
                                done();
                            } else {
                                done(new Error());
                            }
                        });
                    }).catch(err => {
                        done(new Error());
                    });
            });

        });

        describe("delete", () => {

            it("Should return 403 if no permission", (done) => {
                factory.agents.zeroPermissionsAgent
                    .delete("/api/users/6")
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "You are unauthorized to delete users.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 201 for correct behavior", (done) => {
                User.create(newUser).then((user: User) => {
                    factory.agents.superAdminAgent
                        .delete("/api/users/" + user.id)
                        .expect(201)
                        .then(_ => {
                            done();
                        }).catch(_ => {
                            done(new Error());
                        });
                });
            });

        });

    });

    describe("/changePassword/:id", () => {

        describe("put", () => {

            const payload = {password: password, passwordNew: "newpass", passwordNew2: "newpass"};

            it("Should return 400 for non-existing user", (done) => {
                factory.agents.superAdminAgent
                    .put("/api/users/changePassword/100")
                    .send({})
                    .expect(400)
                    .then(_ => {
                        done();
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 403 for unauthorized user", (done) => {
                factory.agents.zeroPermissionsAgent
                    .put("/api/users/changePassword/4")
                    .send({})
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "You do not have permission to change the password of the " +
                            "requested user.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
                });

            it("Should return 406 for wrong current password", (done) => {
                const load = {...payload};
                load.password = "bad";

                factory.agents.zeroPermissionsAgent
                    .put("/api/users/changePassword/6")
                    .send(load)
                    .expect(406)
                    .then((res: any) => {
                        if (res.body.message === "The password submitted is not the current" +
                            " password of this user.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });

            });

            it("Should return 400 for request with wrong types", (done) => {
                const load = {password: password, passwordNew: true, passwordNew2: "newpass"};

                factory.agents.zeroPermissionsAgent
                    .put("/api/users/changePassword/6")
                    .send(load)
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "The passwords submitted were not of type " +
                            "'string'") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 406 for request with unequal new passwords", (done) => {
                const load = {...payload};
                load.passwordNew2 = "doggos";

                factory.agents.superAdminAgent
                    .put("/api/users/changePassword/1")
                    .send(load)
                    .expect(406)
                    .then((res: any) => {
                        if (res.body.message === "The pair of new passwords submitted was not " +
                            "equal.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });

            });

            it("Should change password correctly", (done) => {

                factory.agents.superAdminAgent
                    .put("/api/users/changePassword/6")
                    .send(payload)
                    .expect(200)
                    .then(_ => {
                        done();
                    }).catch(_ => {
                        done(new Error());
                    });

            });

        });

    });

    describe("/approve/:approvalString", () => {

        describe("all", () => {

            it("Should return 200 for unknown link", (done) => {
                factory.agents.nobodyUserAgent
                    .get("/api/users/approve/aiewgdshoi")
                    .expect(302)
                    .then((res: any) => {
                        if (res.headers.location === "/login") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(_ => {
                        done(new Error());
                    });
            });

            it("Should return 200 for correct execution", (done) => {

                User.create(newUser).then((user: User) => {
                    factory.agents.nobodyUserAgent
                        .get("/api/users/approve/" + user.approvingHash)
                        .expect(302)
                        .then((res: any) => {
                            user.destroy().then(_ => {
                                if (res.headers.location === "/completed_registration") {
                                    done();
                                } else {
                                    done(new Error());
                                }
                            });
                        }).catch(_ => {
                            done(new Error());
                        });
                });

            });

        });

    });
});

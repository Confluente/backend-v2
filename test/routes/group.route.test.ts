import {TestFactory} from "../testFactory";
import {newGroup} from "../test.data";

const factory: TestFactory = new TestFactory();

describe("group.route.ts '/api/groups'", () => {

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

    /**
     * Checks if retrieving all groups works.
     */
    describe("Retrieving all groups", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.get("/api/groups/").expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Correctly retrieves all groups", (done) => {
           factory.agents.superAdminAgent.get("/api/groups/").then(function(res: any): any {
               if (res.body.length > 1 && res.body[0].fullName === "Organizing Group") {
                   done();
               } else {
                   done(new Error());
               }
           }).catch(function(_: any): any {
               done(new Error());
           });
        });
    });


    /**
     * Checks if creating a new group works.
     */
    describe("Creating a new group", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.post("/api/groups/").expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error without displayName", (done) => {
            const newGroupWithoutDisplayName = { ...newGroup };
            delete newGroupWithoutDisplayName.displayName;
            factory.agents.superAdminAgent.post("/api/groups/").send(newGroupWithoutDisplayName).expect(400)
                .then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error without fullName", (done) => {
            const newGroupWithoutFullName = { ...newGroup };
            delete newGroupWithoutFullName.fullName;
            factory.agents.superAdminAgent.post("/api/groups/").send(newGroupWithoutFullName).expect(400)
                .then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error without description", (done) => {
            const newGroupWithoutDescription = { ...newGroup };
            delete newGroupWithoutDescription.description;
            factory.agents.superAdminAgent.post("/api/groups/").send(newGroupWithoutDescription).expect(400)
                .then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error without email", (done) => {
            const newGroupWithoutEmail = { ...newGroup };
            delete newGroupWithoutEmail.email;
            factory.agents.superAdminAgent.post("/api/groups/").send(newGroupWithoutEmail).expect(400)
                .then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error without type", (done) => {
            const newGroupWithoutType = { ...newGroup };
            delete newGroupWithoutType.type;
            factory.agents.superAdminAgent.post("/api/groups/").send(newGroupWithoutType).expect(400)
                .then(function(_: any): any {
                    done();
                }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Correctly creates new group", (done) => {
           factory.agents.superAdminAgent.post("/api/groups/").send(newGroup).expect(201)
               .then(function(res: any): any {
                factory.agents.superAdminAgent.get("/api/groups/" + res.body.id).then(function(result: any): any {
                    if (result.body.description === newGroup.description) {
                        done();
                    } else {
                        done(new Error());
                    }
                });
           }).catch(function(_: any): any {
               done(new Error());
           });
        });
    });

    /**
     * Checks if getting a group works.
     */
    describe("Retrieving a group", () => {

        it("Returns error without proper permissions", (done) => {
           factory.agents.zeroPermissionsAgent.get("/api/groups/1").expect(403).then(function(_: any): any {
               done();
           }).catch(function(_: any): any {
               done(new Error());
           });
        });

        it("Returns error when not found", (done) => {
            factory.agents.superAdminAgent.get("/api/groups/314159").expect(404).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Correctly returns group", (done) => {
            factory.agents.superAdminAgent.get("/api/groups/1").expect(200)
                .then((res: any) => {
                if (res.body.fullName === "Organizing Group") {
                    done();
                } else {
                    done(new Error());
                }
            }).catch(function(_: any): any {
                done(new Error());
            });
        });
    });

    // TODO test editing existing group.
    // TODO test deleting existing group.
    // TODO test getting existing groups of type.
});

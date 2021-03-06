import {TestFactory} from "../testFactory";
import {newRole, newPartialRole} from "../test.data";

const factory: TestFactory = new TestFactory();

describe("role.route.ts '/api/role'", () => {

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
     * Checks if retrieving all roles works.
     */
    describe("Get all roles", () => {

        it("Returns error without proper permissions", (done) => {
           factory.agents.zeroPermissionsAgent.get("/api/roles/")
               .expect(403).then(_ => {
               done();
           }).catch(_ => {
               done(new Error());
           });
        });

        it("Correctly returns all roles", (done) => {
           factory.agents.superAdminAgent.get("/api/roles/")
               .expect(200).then(res => {
                if (res.body.length === 6 && res.body[1].name === "Admin") {
                    done();
                } else {
                    done(new Error());
                }
           }).catch(_ => {
               done(new Error());
           });
        });
    });

    /**
     * Checks if creating a new role works.
     */
    describe("Create new role", () => {

        it("Returns error without proper permissions", (done) => {
           factory.agents.zeroPermissionsAgent.post("/api/roles/")
               .send(newRole).expect(403).then(_ => {
              done();
           }).catch((res: any) => {
               done(new Error());
           });
        });

        it("Successfully creates new role", (done) => {
            factory.agents.superAdminAgent.post("/api/roles/")
                .send(newRole).expect(201).then(res => {
                if (res.body.name !== newRole.name) {
                    done(new Error());
                }

                factory.agents.superAdminAgent.get("/api/roles/" + res.body.id)
                    .expect(200).then(_ => {
                        done();
                }).catch(_ => {
                    done(new Error());
                });
            }).catch(_ => {
                done(new Error());
            });
        });

        it("Creates new role with missing fields", (done) => {
            factory.agents.superAdminAgent.post("/api/roles/")
                .send(newPartialRole).expect(201).then(res => {
                if (res.body.name === newPartialRole.name && !res.body.USER_MANAGE) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });
    });
});

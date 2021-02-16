import {TestFactory} from "../testFactory";
import {cleanDb} from "../test.helper";
import {User} from "../../src/models/database/user.model";
import {getAgent, nonActiveMember} from "../test.data";
const factory: TestFactory = new TestFactory();

describe("auth.ts (/api/auth)", () => {

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

            it("Test if standard auth call works", (done) => {
                factory.agents.activeMemberAgent.get("/api/auth")
                    .expect(200)
                    .then(function(_: any): any {
                        done();
                    }).catch(function(_: any): any {
                    done(new Error());
                });
            });

            it("Test if error if not logged in", (done) => {
                factory.agents.nobodyUserAgent.get("/api/auth")
                    .expect(401)
                    .then((res: any) => {
                        if (res.body.message === "Request does not have a session." && res.statusCode === 401) {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(function(_: Error): void {
                    done(new Error());
                });
            });
        });
    });

    describe("/login", () => {

        describe("post", () => {

            it("Test standard functionality", (done) => {
                // First delete non active user from db (session is also automatically deleted on cascade
                User.findByPk(nonActiveMember.id).then(function(user: User): void {
                    user.destroy().then(() => {

                        // Instantiate data for inserting new member
                        const naMember = {...nonActiveMember};
                        delete naMember.id;

                        // Create new member
                        User.create(naMember).then(function(dbUser: User): void {

                            // Create new agent
                            const agent = getAgent(factory.app);

                            // login new agent
                            agent.post("/api/auth/login")
                                .send(naMember)
                                .expect(200)
                                .then((res: any) => {
                                    if (res.body.message === "Logged in successfully!") {
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
    });
});

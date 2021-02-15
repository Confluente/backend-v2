import {TestFactory} from "../testFactory";
import {cleanDb} from "../test.helper";
import {User} from "../../src/models/database/user.model";
import {nonActiveMember} from "../test.data";
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
        await cleanDb();
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

            // First delete non active user from db
            User.findByPk(nonActiveMember.id).then(function(user: User): void {
                user.destroy().then(() => {

                });
            });
        });
    });
});

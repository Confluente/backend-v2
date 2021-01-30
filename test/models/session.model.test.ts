import {TestFactory} from "../testFactory";
import {role, session, user} from "../test.data";
import {cleanSessions} from "../test.helper";
import {Session} from "../../src/models/database/session.model";
import {User} from "../../src/models/database/user.model";
import {Role} from "../../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the session model.
 */
describe("session.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
        await Role.create(role);
        await User.create(user);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    /**
     * Check if adding a valid instance works.
     */
    it("Adding a valid session instance", (done) => {
        // Try to create instance
        Session.create(session).then(function(_: Session): void {
            // Successfully created, thus clean table and return successful.
            cleanSessions();
            done();
        }).catch(function(_: Error): void {
            // Failed, thus clean table and raise error.
            cleanSessions();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["token", "userId", "ip", "expires"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid session
                const session_copy = {...session};

                // Delete needed property
                // @ts-ignore
                delete session_copy[prop];

                // Try to create session
                Session.create(session_copy).then(function(_: Session): void {
                    // If successful, clean database and raise error
                    cleanSessions();
                    done(new Error("Created session from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanSessions();
                    if (err.name === "SequelizeValidationError" && err.message.includes("notNull Violation")) {
                        done();
                    } else {
                        done(new Error("Failed to add instance for the wrong reason"));
                    }
                });
            });
        });
    });
});

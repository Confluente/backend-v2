import {TestFactory} from "../testFactory";
import {role, user} from "../test.data";
import {cleanRoles, cleanUsers} from "../test.helper";
import {User} from "../../src/models/database/user.model";
import {Role} from "../../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the user model.
 */
describe("user.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();

        await Role.create(role);
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
    it("Adding a valid user instance", (done) => {
        // Try to create instance
        User.create(user).then(function(_: User): void {
            // Successfully created, thus clean table and return successful.
            cleanUsers();
            done();
        }).catch(function(err: Error): void {
            // Failed, thus clean table and raise error.
            cleanUsers();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["email", "firstName", "lastName", "displayName", "honorsMembership", "passwordHash", "passwordSalt", "approvingHash", "roleId"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid user
                const user_copy = {...user};

                // Delete needed property
                // @ts-ignore
                delete user_copy[prop];

                // Try to create user
                User.create(user_copy).then(function(__: User): void {
                    // If successful, clean database and raise error
                    cleanUsers();
                    done(new Error("Created user from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanUsers();
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

import {TestFactory} from "../../testFactory";
import {roleSuperAdmin} from "../../test.data";
import {cleanRoles} from "../../test.helper";
import {Role} from "../../../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the role model.
 */
describe("role.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
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
    it("Adding a valid page instance", (done) => {
        // Try to create instance
        Role.create(roleSuperAdmin).then(function(_: Role): void {
            // Successfully created, thus clean table and return successful.
            cleanRoles();
            done();
        }).catch(function(_: Error): void {
            // Failed, thus clean table and raise error.
            cleanRoles();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["name"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid role
                const role_copy = {...roleSuperAdmin};

                // Delete needed property
                // @ts-ignore
                delete role_copy[prop];

                // Try to create role
                Role.create(role_copy).then(function(_: Role): void {
                    // If successful, clean database and raise error
                    cleanRoles();
                    done(new Error("Created role from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanRoles();
                    if (err.name === "SequelizeValidationError" && err.message.includes("notNull Violation")) {
                        done();
                    } else {
                        done(new Error("Failed to add instance for the wrong reason"));
                    }
                });
            });
        });
    });

    it('should not be able to create 2 roles with the same name', (done) => {
        // create 2 valid role instances with the same name
        const role_1 = {...roleSuperAdmin};
        const role_2 = {...roleSuperAdmin};
        delete role_2.id;

        // Try to create both roles
        Role.create(role_1).then(function(_: Role): void {
            Role.create(role_2).then(function(__: Role): void {
                // If successful, clean table and raise error
                cleanRoles();
                done(new Error("Was able to add two roles with the same name"));
            }).catch(function(err: Error): void {
                // clean table
                cleanRoles();

                // If not successful for right reason, return, otherwise, raise error.
                if (err.name === "SequelizeUniqueConstraintError") {
                    done();
                } else {
                    done(new Error("Was not able to add second role for the wrong reason"));
                }
            });
        });
    });
});

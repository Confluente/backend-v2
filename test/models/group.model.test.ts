import {TestFactory} from "../testFactory";
import {Group} from "../../src/models/database/group.model";
import {organizingGroup} from "../test.data";
import {assert} from "chai";
import {cleanGroups} from "../test.helper";

const factory: TestFactory = new TestFactory();

/**
 * Tests the group model.
 */
describe("group.model.ts", () => {

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
    it("Adding a valid group instance", (done) => {
        // Try to create instance
        Group.create(organizingGroup).then(function(_: Group): void {
            // Successfully created, thus clean table and return successful.
            cleanGroups();
            done();
        }).catch(function(_: Error): void {
            // Failed, thus clean table and raise error.
            cleanGroups();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["displayName", "fullName", "description", "canOrganize", "email", "type"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid group
                const group_copy = {...organizingGroup};

                // Delete needed property
                // @ts-ignore
                delete group_copy[prop];

                // Try to create group
                Group.create(group_copy).then(function(_: Group): void {
                    // If successful, clean database and raise error
                    cleanGroups();
                    done(new Error("Created group from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanGroups();
                    if (err.name === "SequelizeValidationError" && err.message.includes("notNull Violation")) {
                        done();
                    } else {
                        done(new Error("Failed to add instance for the wrong reason"));
                    }
                });
            });
        });
    });

    it('should not be able to add two groups with the same fullName', (done) => {
        // create 2 valid group instances with the same fullName
        const group_1 = {...organizingGroup};
        const group_2 = {...organizingGroup};

        // Try to create both groups
        Group.create(group_1).then(function(_: Group): void {
            Group.create(group_2).then(function(__: Group): void {
                // If successful, clean table and raise error
                cleanGroups();
                done(new Error("Was able to add two groups with the same fullName"));
            }).catch(function(err: Error): void {
                // clean table
                cleanGroups();

                // If not successful for right reason, return, otherwise, raise error
                if (err.name === "SequelizeUniqueConstraintError") {
                    done();
                } else {
                    done(new Error("Was not able to add second group for the wrong reason"));
                }
            });
        });
    });
});

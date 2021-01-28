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
                }).catch(function(_: Error): void {
                    // If unsuccessful, clean database and return
                    cleanGroups();
                    done();
                });
            });
        });
    });
});
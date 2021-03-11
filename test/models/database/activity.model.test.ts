import {Activity} from "../../../src/models/database/activity.model";
import {organizingGroup, unpublishedActivity} from "../../test.data";
import {assert} from "chai";
import {TestFactory} from "../../testFactory";
import {cleanActivities} from "../../test.helper";
import {Group} from "../../../src/models/database/group.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the activity model.
 */
describe("activity.model.ts", () => {

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
    it("Adding a valid activity instance", (done) => {
        // First instantiate the group that organizes the activity
        Group.create(organizingGroup).then(function(_: Group): void {

            // Try to create instance
            Activity.create(unpublishedActivity).then(function(__: Activity): void {
                // Successfully created, thus clean table and return successful.
                cleanActivities();
                done();
            }).catch(function(__: Error): void {
                // Failed, thus clean table and raise error.
                cleanActivities();
                done(new Error("Could not create instance from valid model"));
            });
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["name", "description", "date"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid activity
                const act_copy = {...unpublishedActivity};

                // Delete needed property
                // @ts-ignore
                delete act_copy[prop];

                // Try to create activity
                Activity.create(act_copy).then(function(_: Activity): void {
                    // If successful, clean database and raise error
                    cleanActivities();
                    done(new Error("Created activity from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanActivities();
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

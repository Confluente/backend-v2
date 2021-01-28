import {TestFactory} from "../testFactory";
import {page} from "../test.data";
import {assert} from "chai";
import {cleanPages} from "../test.helper";
import {Page} from "../../src/models/database/page.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the page model.
 */
describe("page.model.ts", () => {

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
        Page.create(page).then(function(_: Page): void {
            // Successfully created, thus clean table and return successful.
            cleanPages();
            done();
        }).catch(function(_: Error): void {
            // Failed, thus clean table and raise error.
            cleanPages();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe("Adding an invalid instance", () => {
        // Setting needed properties
        const needed_props = ["url", "title", "content", "author"];

        // Test for each needed property
        needed_props.forEach(function(prop: string): void {
            it("Testing specific invalid instance that misses " + prop, (done) => {
                // Copy valid page
                const page_copy = {...page};

                // Delete needed property
                // @ts-ignore
                delete page_copy[prop];

                // Try to create page
                Page.create(page_copy).then(function(_: Page): void {
                    // If successful, clean database and raise error
                    cleanPages();
                    done(new Error("Created page from invalid model"));
                }).catch(function(_: Error): void {
                    // If unsuccessful, clean database and return
                    cleanPages();
                    done();
                });
            });
        });
    });
});

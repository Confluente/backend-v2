import {TestFactory} from "../testFactory";
import {CompanyOpportunity} from "../../src/models/database/company.opportunity.model";
import {companyOpportunity} from "../test.data";
import {cleanCompanyOpportunities} from "../test.helper";

const factory: TestFactory = new TestFactory();

/**
 * Tests the company opportunity model.
 */
describe("company.opportunity.model.ts", () => {

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
    it("Adding a valid company opportunity instance", (done) => {
        // Try to create instance
        CompanyOpportunity.create(companyOpportunity).then(function(_: CompanyOpportunity): void {
            // Successfully created, thus clean table and return successful.
            cleanCompanyOpportunities();
            done();
        }).catch(function(_: Error): void {
            // Failed, thus clean table and raise error.
            cleanCompanyOpportunities();
            done(new Error("Could not create instance from valid model"));
        });
    });

    /**
     * Check if trying to add an invalid instance raises an error.
     */
    describe('Adding an invalid instance', () => {
        // Setting needed properties
        const needed_props = ["title", "companyName", "description", "imageUrl", "contactEmail", "link", "educationLevel", "category"];

        needed_props.forEach(function(prop: string): void {
            it('Testing specific invalid instance that misses ' + prop, (done) => {
                // Copy valid instance
                const opp_copy = {...companyOpportunity};

                // Delete needed property
                // @ts-ignore
                delete opp_copy[prop];

                // Try to create instance
                CompanyOpportunity.create(opp_copy).then(function(_: CompanyOpportunity): void {
                    // If successful, clean database and raise error
                    cleanCompanyOpportunities();
                    done(new Error("Created company opportunity from invalid model"));
                }).catch(function(err: Error): void {
                    // If unsuccessful, clean database and return
                    cleanCompanyOpportunities();
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

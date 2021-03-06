import {TestFactory} from "../testFactory";
import {CompanyOpportunity} from "../../src/models/database/company.opportunity.model";

const factory: TestFactory = new TestFactory();

describe("partner.route.ts '/api/partners'", () => {

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

    describe("/companyOpportunities", () => {

        describe("get", () => {

            it("Should return all companyOpportunities", (done) => {
                factory.agents.superAdminAgent
                    .get("/api/partners/companyOpportunities")
                    .expect(200)
                    .then(function(res: any): void {
                        const opportunities = res.body;

                        if (opportunities.length === 1 &&
                            opportunities[0].imageUrl === "some url") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                    done(new Error());
                });
            });

            it("Should return unauthorized if unauthorized", (done) => {
                factory.agents.zeroPermissionsAgent.get("/api/partners/companyOpportunities")
                    .expect(403)
                    .then(function(res: any): void {
                        if (res.body.message === "You do not have the permissions to view company opportunities.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                    done(new Error());
                });
            });

        });

        describe("post", () => {

            const companyOpportunity = {
                title: "Titles",
                companyName: "Some sponsor",
                description: "Super cool description",
                imageUrl: "some url",
                contactEmail: "some email",
                link: "A link to vacancy of the sponsor",
                educationLevel: "Pleb",
                category: "Vacancy"
            };

            it("Should create a company opportunity", (done) => {
                factory.agents.superAdminAgent
                    .post("/api/partners/companyOpportunities")
                    .send(companyOpportunity)
                    .expect(201)
                    .then(function(res: any): void {
                        const opportunity = res.body;

                        CompanyOpportunity.findByPk(opportunity.id).then(function(co: CompanyOpportunity): void {
                            co.destroy();
                        });

                        if (opportunity.description === "Super cool description") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(function(_: any): void {
                    done(new Error());
                });
            });

            it("Should return unauthorized for zero permissions user", (done) => {
                factory.agents.zeroPermissionsAgent
                    .post("/api/partners/companyOpportunities")
                    .send(companyOpportunity)
                    .expect(403)
                    .then(function(res: any): void {
                        if (res.body.message === "You do not have permissions to create a company " +
                            "opportunity") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(function(_: any): void {
                        done(new Error());
                });
            });

            it("Should throw error on incomplete create request", (done) => {
                const opportunity = {...companyOpportunity};
                delete opportunity.title;

                factory.agents.superAdminAgent
                    .post("/api/partners/companyOpportunities")
                    .send(opportunity)
                    .expect(400)
                    .then(function(res: any): void {
                        if (res.body.message === "Something went wrong in creating the company " +
                            "opportunity. Check the logs for a detailed message.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch(function(_: any): void {
                        done(new Error());
                });
            });

        });
    });

    describe("/companyOpportunities/:id", () => {

        describe("all (via the get)", () => {

            // it("")

        });

    });
});

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

        describe("get (and all)", () => {

            it("Should return company opportunity", (done) => {
                factory.agents.superAdminAgent
                    .get("/api/partners/companyOpportunities/1")
                    .expect(200)
                    .then((res: any) => {
                        const opportunity = res.body;

                        if (opportunity.title === "Super duper cool vacancy") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: Error) => {
                        done(new Error());
                    });
            });

            it("Should return unauthorized for zero permissions user", (done) => {
                factory.agents.zeroPermissionsAgent
                    .get("/api/partners/companyOpportunities/1")
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "Unauthorized for actions with specific company " +
                            "opportunities.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

            it("Should return 404 for unknown opportunity", (done) => {
                factory.agents.superAdminAgent
                    .get("/api/partners/companyOpportunities/100")
                    .expect(404)
                    .then((res: any) => {
                        if (res.body.message === "Company opportunity could not be found in the " +
                            "database.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

        });

        describe("put", () => {

            it("Should return unauthorized for user with PARTNER_VIEW permission, " +
                "but no PARTNER_MANAGE permission", (done) => {

                factory.agents.nobodyUserAgent
                    .put("/api/partners/companyOpportunities/1")
                    .send({title: "edited title"})
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "Unauthorized to edit company opportunity.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

            it("Should return 400 if wrongfully typed update", (done) => {
                factory.agents.superAdminAgent
                    .put("/api/partners/companyOpportunities/1")
                    .send({title: true})
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "Could not update company opportunity.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((res: any) => {
                        done(new Error());
                    });
            });

            it("Should return 400 if trying to set mandatory property to null", (done) => {
                factory.agents.superAdminAgent
                    .put("/api/partners/companyOpportunities/1")
                    .send({title: null})
                    .expect(400)
                    .then((res: any) => {
                        if (res.body.message === "Could not update company opportunity.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

            it("Should update companyOpportunity correctly", (done) => {
                factory.agents.superAdminAgent
                    .put("/api/partners/companyOpportunities/1")
                    .send({title: "edited title"})
                    .expect(200)
                    .then((res: any) => {
                        if (res.body.title === "edited title") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                        done(new Error());
                    });
            });

        });

        describe("delete", () => {

            it("Should return unauthorized for user with PARTNER_VIEW permission, " +
                "but no PARTNER_MANAGE permission", (done) => {

                factory.agents.nobodyUserAgent
                    .delete("/api/partners/companyOpportunities/1")
                    .expect(403)
                    .then((res: any) => {
                        if (res.body.message === "Unauthorized to delete company opportunity.") {
                            done();
                        } else {
                            done(new Error());
                        }
                    }).catch((_: any) => {
                    done(new Error());
                });
            });

            it("Should delete company opportunity correctly", (done) => {
                CompanyOpportunity.create(companyOpportunity).then((co: CompanyOpportunity) => {
                    factory.agents.superAdminAgent
                        .delete("/api/partners/companyOpportunities/" + co.id)
                        .expect(204)
                        .then((_: any) => {
                            done();
                        }).catch((_: any) => {
                            done(new Error());
                        });
                });
            });
        });
    });
});

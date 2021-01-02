import express, {Response, Request, Router} from "express";

import {CompanyOpportunity} from "../models/company.opportunity.model";
import {User} from "../models/user.model";

const permissions: any = require("../permissions");

const router: Router = express.Router();

router.route("/companyOpportunities")
    .get(function(req: Request, res: Response): void {
        /**
         * Route for getting all companyOpportunities from the database.
         */
        const user: User = res.locals.session ? res.locals.session.user : null;
        permissions.check(user, {type: "COMPANY_OPPORTUNITY_VIEW"}).then(function(result: boolean): void {
            if (!result) {
                res.status(403).send("You do not have the permissions to view internships");
            }

            CompanyOpportunity.findAll({
                order: [
                    ["id", "ASC"]
                ]
            }).then(function(results: CompanyOpportunity[]): void {
                console.log(results);
                res.send(results);
            });
        });
    })
    .post(function(req: Request, res: Response): any {
        /**
         * Route for creating a company opportunity.
         */
        const user: User = res.locals.session ? res.locals.session.user : null;
        permissions.check(user, {type: "COMPANY_OPPORTUNITY_MANAGE", value: req.params.id})
            .then(function(result: boolean): CompanyOpportunity {
            if (!result) {
                res.status(403).send("You do not have permissions to create a company opportunity");
            }

            return CompanyOpportunity.create(req.body)
                .then(function(createdCompanyOpportunity: CompanyOpportunity): void {
                res.status(201).send(createdCompanyOpportunity);
            }).catch(function(err: Error): void {
                console.error(err);
                res.sendStatus(400).send("Something went wrong in creating the company opportunity. " +
                    "Check the logs for a detailed message.");
            });
        });
    });

router.route("/companyOpportunities/:id")
    .all(function(req: Request, res: Response, next: any): void {
        CompanyOpportunity.findByPk(req.params.id).then(function(foundCompanyOpportunity: CompanyOpportunity): void {
            if (foundCompanyOpportunity === null) {
                res.status(404).send({status: "Company opportunity could not be found in the database."});
            } else {
                res.locals.companyOpportunity = foundCompanyOpportunity;
                next();
            }
        });
    })
    .get(function(req: Request, res: Response): any {
        /**
         * Route for getting a specific company opportunity.
         */
        const user: User = res.locals.session ? res.locals.session.user : null;
        permissions.check(user, {type: "COMPANY_OPPORTUNITY_VIEW", value: req.params.id})
            .then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            res.send(res.locals.companyOpportunity);
        }).done();
    })
    .put(function(req: Request, res: Response): any {
        /**
         * Route for editing a specific company opportunity.
         */
        const user: User = res.locals.session ? res.locals.session.user : null;
        permissions.check(user, {type: "COMPANY_OPPORTUNITY_MANAGE", value: req.params.id})
            .then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            return res.locals.companyOpportunity.update(req.body)
                .then(function(putCompanyOpportunity: CompanyOpportunity): void {
                res.send(putCompanyOpportunity);
            }, function(err: Error): void {
                console.error("Could not update company opportunity with id " + res.locals.companyOpportunity.id);
                console.error(err);
            });
        });
    })
    .delete(function(req: Request, res: Response): any {
        /**
         * Route for deleting a company opportunity.
         */
        const user: User = res.locals.session ? res.locals.session.user : null;
        permissions.check(user, {type: "COMPANY_OPPORTUNITY_MANAGE", value: req.params.id})
            .then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            return res.locals.companyOpportunity.destroy();
        }).then(function(): void {
            res.status(204).send({status: "Successful"});
        });
    });

router.route("/companyOpportunities/category/:category")
    /**
     * Gets all company opportunities of a certain category from the database.
     */
    .get(function(req: Request, res: Response): void {
        CompanyOpportunity.findAll({
            where: {category: req.params.category}
        }).then(function(foundCompanyOpportunities: CompanyOpportunity[]): void {
            res.send(foundCompanyOpportunities);
        });
    });

module.exports = router;

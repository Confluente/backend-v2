import express, {Response, Request, Router} from "express";

import {CompanyOpportunity} from "../models/database/company.opportunity.model";

import {checkPermission} from "../permissions";

const router: Router = express.Router();

router.route("/companyOpportunities")
    /**
     * Route for getting all companyOpportunities from the database.
     */
    .get(function(req: Request, res: Response): void {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check permission
        checkPermission(userId, {type: "PARTNER_VIEW"}).then(function(result: boolean): void {

            // If no permission, return
            if (!result) {
                res.status(403).send("You do not have the permissions to view internships");
            }

            // If permission, get all company opportunities (in order)
            CompanyOpportunity.findAll({
                order: [
                    ["id", "ASC"]
                ]
            }).then(function(results: CompanyOpportunity[]): void {
                res.send(results);
            });
        }).catch((err: Error) => {
            console.error(err);
            res.status(400).send("Error in getting all company opportunities");
        });
    })

    /**
     * Route for creating a company opportunity.
     */
    .post(function(req: Request, res: Response): any {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check permission
        checkPermission(userId, {type: "PARTNER_MANAGE", value: +req.params.id})
            .then(function(result: boolean): any {

            // Return if no permission
            if (!result) {
                return res.status(403).send("You do not have permissions to create a company opportunity");
            }

            // Create instance
            CompanyOpportunity.create(req.body)
                .then(function(createdCompanyOpportunity: CompanyOpportunity): any {

                // send back new instance
                return res.status(201).send(createdCompanyOpportunity);
            }).catch(function(err: Error): any {

                console.error(err);
                return res.sendStatus(400).send("Something went wrong in creating the company opportunity. " +
                    "Check the logs for a detailed message.");
            });
        }).catch(function(err: Error): any {
            return res.sendStatus(804).send("smth");
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

    /**
     * Route for getting a specific company opportunity.
     */
    .get(function(req: Request, res: Response): any {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_VIEW", value: +req.params.id})
            .then(function(result: boolean): any {
            if (!result) {
                return res.sendStatus(403);
            }

            res.send(res.locals.companyOpportunity);
        });
    })

    /**
     * Route for editing a specific company opportunity.
     */
    .put(function(req: Request, res: Response): any {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_MANAGE", value: +req.params.id})
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

    /**
     * Route for deleting a company opportunity.
     */
    .delete(function(req: Request, res: Response): any {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_MANAGE", value: +req.params.id})
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

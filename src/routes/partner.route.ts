import express, {Response, Request, Router, NextFunction} from "express";

import {CompanyOpportunity} from "../models/database/company.opportunity.model";

import {checkPermission} from "../permissions";

const router: Router = express.Router();

router.route("/companyOpportunities")
    /**
     * Route for getting all companyOpportunities from the database.
     */
    .get((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check permission
        checkPermission(userId, {type: "PARTNER_VIEW"}).then((result: boolean) => {

            // If no permission, return
            if (!result) {
                return res.status(403).send({message: "You do not have the permissions to view company " +
                        "opportunities."});
            }

            // If permission, get all company opportunities (in order)
            CompanyOpportunity.findAll({
                order: [
                    ["id", "ASC"]
                ]
            }).then((results: CompanyOpportunity[]) => {
                return res.status(200).send(results);
            }).catch((err: Error) => {
                console.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
        });
    })

    /**
     * Route for creating a company opportunity.
     */
    .post((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check permission
        checkPermission(userId, {type: "PARTNER_MANAGE"})
            .then((result: boolean) => {

            // Return if no permission
            if (!result) {
                return res.status(403).send("You do not have permissions to create a company opportunity");
            }

            // Create instance
            CompanyOpportunity.create(req.body) .then((createdCompanyOpportunity: CompanyOpportunity) => {

                // send back new instance
                return res.status(201).send(createdCompanyOpportunity);
            }).catch((err: Error) => {
                console.error(err);
                return res.status(400).send("Something went wrong in creating the company opportunity. " +
                    "Check the logs for a detailed message.");
            });
        }).catch((err: Error) => {
            console.error(err);
            return res.sendStatus(500);
        });
    });

router.route("/companyOpportunities/:id")
    .all((req: Request, res: Response, next: NextFunction) => {
        CompanyOpportunity.findByPk(req.params.id).then((foundCompanyOpportunity: CompanyOpportunity) => {
            if (foundCompanyOpportunity === null) {
                return res.status(404).send({status: "Company opportunity could not be found in the database."});
            } else {
                res.locals.companyOpportunity = foundCompanyOpportunity;
                next();
            }
        });
    })

    /**
     * Route for getting a specific company opportunity.
     */
    .get((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check whether allowed to view
        checkPermission(userId, {type: "PARTNER_VIEW", value: +req.params.id}).then((result: boolean) => {

            // Return if no permission.
            if (!result) {
                return res.status(403).send("Unauthorized to get company opportunity with id " + req.params.id);
            }

            // Otherwise, send company opportunity;
            res.status(200).send(res.locals.companyOpportunity);
        }).catch((err: Error) => {
            console.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Route for editing a specific company opportunity.
     */
    .put((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check whether user is allowed to manage partner data.
        checkPermission(userId, {type: "PARTNER_MANAGE"}).then((result: boolean) => {

            // Return if no permission
            if (!result) {
                return res.status(403).send("Unauthorized to edit company opportunity with id " + req.params.id);
            }

            //
            res.locals.companyOpportunity.update(req.body).then((putCompanyOpportunity: CompanyOpportunity) => {
                return res.send(putCompanyOpportunity);
            }).catch((err: Error) => {
                console.error("Could not update company opportunity with id " + res.locals.companyOpportunity.id);
                console.error(err);
            });
        });
    })

    /**
     * Route for deleting a company opportunity.
     */
    .delete((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_MANAGE"})
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
    .get((req: Request, res: Response) => {
        CompanyOpportunity.findAll({
            where: {category: req.params.category}
        }).then(function(foundCompanyOpportunities: CompanyOpportunity[]): void {
            res.send(foundCompanyOpportunities);
        });
    });

module.exports = router;

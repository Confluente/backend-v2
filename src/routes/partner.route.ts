import express, {Response, Request, Router, NextFunction} from "express";

import {CompanyOpportunity} from "../models/database/company.opportunity.model";

import {checkPermission} from "../permissions";
import {logger} from "../logger";

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
                return res.status(403).send({
                    message: "You do not have the permissions to view company " +
                        "opportunities."
                });
            }

            // If permission, get all company opportunities (in order)
            CompanyOpportunity.findAll({
                order: [
                    ["id", "ASC"]
                ]
            }).then((results: CompanyOpportunity[]) => {
                return res.status(200).send(results);
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
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
                    return res.status(403).send({
                        message: "You do not have permissions to create a company " +
                            "opportunity"
                    });
                }

                // Create instance
                CompanyOpportunity.create(req.body).then((createdCompanyOpportunity: CompanyOpportunity) => {

                    // send back new instance
                    return res.status(201).send(createdCompanyOpportunity);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.status(400).send({
                        message: "Something went wrong in creating the company " +
                            "opportunity. Check the logs for a detailed message."
                    });
                });
            }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    });

router.route("/companyOpportunities/:id")
    .all((req: Request, res: Response, next: NextFunction) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        // Check for PARTNER_VIEW permission, which is needed for every sub route
        checkPermission(userId, {type: "PARTNER_VIEW"}).then((result: boolean) => {

            // If no permission, return 403
            if (!result) {
                return res.status(403).send({message: "Unauthorized for actions with specific company " +
                        "opportunities."});
            }

            // Find the specific company opportunity in the database
            CompanyOpportunity.findByPk(req.params.id).then((foundCompanyOpportunity: CompanyOpportunity | null) => {

                // If not found in the database, then return 404
                if (foundCompanyOpportunity === null) {
                    return res.status(404).send({message: "Company opportunity could not be found in the " +
                            "database."});
                } else {
                    // Store found opportunity in response for future processing.
                    res.locals.companyOpportunity = foundCompanyOpportunity;
                    next();
                }
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Route for getting a specific company opportunity.
     */
    .get((req: Request, res: Response) => {
        // Send company opportunity;
        res.status(200).send(res.locals.companyOpportunity);
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
                return res.status(403).send({message: "Unauthorized to edit company opportunity."});
            }

            // Update company opportunity in database
            res.locals.companyOpportunity.update(req.body).then((putCompanyOpportunity: CompanyOpportunity) => {
                return res.status(200).send(putCompanyOpportunity);
            }).catch((err: Error) => {
                logger.error(err);
                return res.status(400).send({message: "Could not update company opportunity."});
            });
        }).catch((err: Error) => {
            logger.error(err);
            return res.sendStatus(500);
        });
    })

    /**
     * Route for deleting a company opportunity.
     */
    .delete((req: Request, res: Response) => {
        // Get user id if request has session
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_MANAGE"})
            .then((result: boolean) => {
                if (!result) {
                    return res.status(403).send({message: "Unauthorized to delete company opportunity."});
                }

                // Destroy company opportunity in database
                res.locals.companyOpportunity.destroy().then(() => {
                    return res.sendStatus(204);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.sendStatus(500);
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
    });

router.route("/companyOpportunities/category/:category")
    /**
     * Gets all company opportunities of a certain category from the database.
     */
    .get((req: Request, res: Response) => {
        const userId: number = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, {type: "PARTNER_VIEW"})
            .then((result: boolean) => {
                if (!result) {
                    return res.status(403).send({message: "Unauthorized to get all company opportunities " +
                            "of one category."});
                }

                // Find all company opportunities of requested category.
                CompanyOpportunity.findAll({
                    where: {category: req.params.category}
                }).then((foundCompanyOpportunities: CompanyOpportunity[]) => {
                    // Return status
                    return res.status(200).send(foundCompanyOpportunities);
                }).catch((err: Error) => {
                    logger.error(err);
                    return res.sendStatus(500);
                });
            }).catch((err: Error) => {
                logger.error(err);
                return res.sendStatus(500);
            });
    });

module.exports = router;

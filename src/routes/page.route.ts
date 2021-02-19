import express, {Request, Response, Router} from "express";

import {Page} from "../models/database/page.model";
import {PageWeb} from "../models/web/page.web.model";

import {checkPermission, requireAllPermissions} from "../permissions";

const router: Router = express.Router();

router.route("/:url([^\?]+)")
    /**
     * Gets a specific page from the database
     */
    .get(function(req: Request, res: Response): any {
        // Check if client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        checkPermission(user, {
            type: "PAGE_VIEW",
        }).then(function(result: boolean): any {
            // If no result, then the client has no permission
            if (!result) { return res.sendStatus(403); }

            Page.findOne({
                where: {
                    url: req.params.url
                },
                attributes: ["url", "title", "content", "author"]
            }).then(async function(page: Page): Promise<any> {

                // If page is not found, send 404
                if (!page) {
                    return res.sendStatus(404);
                }

                const webPage = await PageWeb.getWebModelFromDbModel(page);

                // Send page to the client
                res.send(webPage);
            });
        });
    })

    /**
     * Edits a page
     */
    .put(requireAllPermissions([{type: "PAGE_MANAGE"}]), function(req: Request, res: Response): any {

        // Stores the edit parameters
        const values: any = req.body;

        if (!req.body.url || req.body.url === req.params.url) {
            values.url = req.params.url;
        } else {
            throw new Error("Not implemented: change page.url");
        }

        return Page.upsert(values).then(function(result: any): any {
            return Page.findAll().then(function(foundPages: Page[]): any {
                return res.status(201).send(foundPages);
            });
        });
    })

    /**
     * Deletes a page from the database
     */
    .delete(requireAllPermissions([{type: "PAGE_MANAGE"}]), function(req: Request, res: Response): any {
        return Page.destroy({where: {url: req.params.url}}).then(function(result: any): any {
            return res.sendStatus(204);
        });
    });

router.get("/:url/view", function(req: Request, res: Response): any {
    return Page.findOne({where: {url: req.params.url}}).then(function(foundPage: Page): any {
        if (!foundPage) { return res.redirect("/404.html"); }

        // Transform dbPage to webPage
        const page = PageWeb.getWebModelFromDbModel(foundPage);

        res.send(page);
    });
});

router.get("/", function(req: Request, res: Response): any {
    // Check if client is logged in
    const user = res.locals.session ? res.locals.session.userId : null;

    checkPermission(user, {
        type: "PAGE_MANAGE",
    }).then(function(result: boolean): any {
        // If no result, then the client has no permission
        if (!result) { return res.sendStatus(403); }

        // Retrieve all pages
        Page.findAll({
            attributes: ["url", "title", "content", "author"]
        }).then(async function(foundPages: Page[]): Promise<void> {

            // Transform dbPages to webPages
            const pages = await PageWeb.getArrayOfWebModelsFromArrayOfDbModels(foundPages);

            res.send(pages);
        });
    });
});

module.exports = router;

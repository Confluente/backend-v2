import express, {Request, Response, Router} from "express";

import {Page} from "../models/database/page.model";
import {PageWeb} from "../models/web/page.web.model";

import {checkPermission} from "../permissions";
import {logger} from "../logger";

const router: Router = express.Router();

router.route("/:url([^\?]+)")
    /**
     * Gets a specific page from the database
     */
    .get((req: Request, res: Response) => {
        // Check if client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        checkPermission(user, {
            type: "PAGE_VIEW",
        }).then((result: boolean) => {
            // If no result, then the client has no permission
            if (!result) { return res.sendStatus(403); }

            Page.findOne({
                where: {
                    url: req.params.url
                },
                attributes: ["url", "title", "content", "author"]
            }).then(async (page: Page): Promise<any> => {

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
    .put((req: Request, res: Response) => {
        // Check if client is logged in
        const user = res.locals.session ? res.locals.session.userId : null;

        checkPermission(user, {
            type: "PAGE_MANAGE",
        }).then((result: boolean) => {
            // If no result, then the client has no permission
            if (!result) { return res.sendStatus(403); }


            // Stores the edit parameters
            const values: any = req.body;

            if (!req.body.url || req.body.url === req.params.url) {
                values.url = req.params.url;
            } else {
                throw new Error("Not implemented: change page.url");
            }

            return Page.upsert(values).then((pageResult: any) => {
                return Page.findAll().then((foundPages: Page[]) => {
                    return res.status(201).send(foundPages);
                });
            });
        });
    })

    /**
     * Deletes a page from the database
     */
    .delete((req: Request, res: Response) => {
        // Check if client is logged in
        const userId = res.locals.session ? res.locals.session.userId : null;

        checkPermission(userId, { type: "PAGE_MANAGE" }).then((result: boolean) => {
            // If false, then the client has no permission
            if (!result) { return res.sendStatus(403); }

            return Page.destroy({where: {url: req.params.url}}).then((_: any) => {
                return res.sendStatus(204);
            });

        }).catch((err: Error) => {
            logger.error(err);
            return res.status(400).send("Error in deleting the page.");
        });
    });

router.get("/:url/view", (req: Request, res: Response) => {
    return Page.findOne({where: {url: req.params.url}}).then((foundPage: Page) => {
        if (!foundPage) { return res.redirect("/404.html"); }

        // Transform dbPage to webPage
        const page = PageWeb.getWebModelFromDbModel(foundPage);

        res.send(page);
    });
});

router.get("/", (req: Request, res: Response) => {
    // Check if client is logged in
    const user = res.locals.session ? res.locals.session.userId : null;

    checkPermission(user, {
        type: "PAGE_MANAGE",
    }).then((result: boolean) => {
        // If no result, then the client has no permission
        if (!result) { return res.sendStatus(403); }

        // Retrieve all pages
        Page.findAll({
            attributes: ["url", "title", "content", "author"]
        }).then(async (foundPages: Page[]) => {

            // Transform dbPages to webPages
            const pages = await PageWeb.getArrayOfWebModelsFromArrayOfDbModels(foundPages);

            return res.send(pages);
        });
    });
});

module.exports = router;

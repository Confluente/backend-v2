import express, {Request, Response, Router} from "express";

import marked from "marked";
import {Page} from "../models/database/page.model";
import {PageWeb} from "../models/web/page.web.model";

const permissions: any = require("../permissions");

const router: Router = express.Router();

router.route("/:url([^\?]+)")
    /**
     * Gets a specific page from the database
     */
    .get(function(req: Request, res: Response): any {
        Page.findOne({
            where: {
                url: req.params.url
            },
            attributes: ["url", "title", "content", "author"]
        }).then(function(page: Page): any {

            // If page is not found, send 404
            if (!page) { return res.sendStatus(404); }

            const webPage = PageWeb.getWebModelFromDbModel(page);

            // Send page to the client
            res.send(webPage);
        });
    })

    /**
     * Edits a page
     */
    .put(permissions.requireAll({type: "PAGE_MANAGE"}), function(req: Request, res: Response): any {

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
    .delete(permissions.requireAll({type: "PAGE_MANAGE"}), function(req: Request, res: Response): any {
        return Page.destroy({where: {url: req.params.url}}).then(function(result: any): any {
            return res.sendStatus(204);
        });
    });

router.get("/:url/view", function(req: Request, res: Response): any {
    return Page.findOne({where: {url: req.params.url}}).then(function(foundPage: Page): any {
        if (!foundPage) { return res.redirect("/404.html"); }
        res.send(marked(foundPage.content));
    });
});

router.get("/", permissions.requireAll({type: "PAGE_MANAGE"}),
    function(req: Request, res: Response): any {
    return Page.findAll({
        attributes: ["url", "title", "content", "author"]
    }).then(function(foundPages: Page[]): void {
        res.send(foundPages);
    });
});

module.exports = router;

import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/web.model.copy.helper";
import {Page} from "../database/page.model";
import { marked } from 'marked';

export class PageWeb extends AbstractWebModel {
    /**
     * URL of the page.
     */
    public url!: string;

    /**
     * Title of the page.
     */
    public title!: string;

    /**
     * Content of the page in text format.
     */
    public content!: any;

    /**
     * Content of the page in html format
     */
    public htmlContent!: any;

    /**
     * Author of the page.
     */
    public author!: string;

    public static async getWebModelFromDbModel(dbPage: Model): Promise<PageWeb> {
        if (!(dbPage instanceof Page)) {
            throw new Error("page.web.model.getWebModelFromDbModel: dbPage was not a Page instance");
        }

        // @ts-ignore
        const webPage = copyMatchingSourceKeyValues(new PageWeb(), dbPage.dataValues);

        webPage.htmlContent = marked.parse((dbPage as Page).content);

        return webPage;
    }

    public getCopyable(): string[] {
        return ["url", "title", "content", "author"];
    }
}

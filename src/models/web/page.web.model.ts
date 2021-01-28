import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/model.copy.helper";
import {Page} from "../database/page.model";
import marked from "marked";

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

    public static getWebModelFromDbModel(dbPage: Model): PageWeb {
        const webPage = copyMatchingSourceKeyValues(new PageWeb(), dbPage);

        webPage.htmlContent = marked((dbPage as Page).content);

        return webPage;
    }
}

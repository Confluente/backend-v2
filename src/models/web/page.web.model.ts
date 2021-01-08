import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/modelCopyHelper";

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
     * Author of the page.
     */
    public author!: string;

    public static getWebModelFromDbModel(dbPage: Model): PageWeb {
        return copyMatchingSourceKeyValues(new PageWeb(), dbPage);
    }
}

import {Model, DataTypes} from "sequelize";

export class Page extends Model {
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
}

Page.init(
    {
        url: {
            type: new DataTypes.STRING(128),
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        content: {
            type: new DataTypes.TEXT(),
            allowNull: false,
        },
        author: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "page",
        sequelize,
    }
);

Page.sync();

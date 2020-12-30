export class Page extends sequelize.Model {
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
            type: new sequelize.DataTypes.STRING(128),
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        content: {
            type: new sequelize.DataTypes.TEXT(),
            allowNull: false,
        },
        author: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "page",
        sequelize,
    }
);

Page.sync();

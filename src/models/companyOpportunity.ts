class CompanyOpportunity extends sequelize.Model {
    /**
     * Title of the opportunity.
     */
    public title!: string;

    /**
     * Name of the company.
     */
    public companyName!: string;

    /**
     * Description of the opportunity.
     */
    public description!: string;

    /**
     * Link to the image of the company.
     */
    public imageUrl!: string;

    /**
     * Email to contact if you want the opportunity.
     */
    public contactEmail!: string;

    /**
     * Link to the opportunity on the website of the company.
     */
    public link!: string;

    /**
     * Level of education needed for the opportunity
     */
    public educationLevel!: string;

    /**
     * Category of the opportunity
     */
    public category!: string;
}

CompanyOpportunity.init(
    {
        title: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        companyName: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new sequelize.DataTypes.STRING(8192),
            allowNull: false,
        },
        imageUrl: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        contactEmail: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        link: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        educationLevel: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        category: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "company_opportunity",
        sequelize,
    }
)

CompanyOpportunity.sync();

module.exports = CompanyOpportunity;

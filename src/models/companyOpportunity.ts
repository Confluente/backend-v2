import {Table, Column, Model, DataType, AllowNull} from 'sequelize-typescript';

@Table
export class CompanyOpportunity extends Model {
    /**
     * Title of the opportunity.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public title!: string;

    /**
     * Name of the company.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public companyName!: string;

    /**
     * Description of the opportunity.
     */
    @Column(DataType.STRING(8192))
    @AllowNull(false)
    public description!: string;

    /**
     * Link to the image of the company.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public imageUrl!: string;

    /**
     * Email to contact if you want the opportunity.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public contactEmail!: string;

    /**
     * Link to the opportunity on the website of the company.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public link!: string;

    /**
     * Level of education needed for the opportunity
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public educationLevel!: string;

    /**
     * Category of the opportunity
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public category!: string;
}

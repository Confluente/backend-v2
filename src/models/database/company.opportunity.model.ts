import {Table, Column, Model, DataType, AllowNull} from 'sequelize-typescript';

@Table({timestamps: false})
export class CompanyOpportunity extends Model<CompanyOpportunity> {

    /**
     * Title of the opportunity.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public title!: string;

    /**
     * Name of the company.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public companyName!: string;

    /**
     * Description of the opportunity.
     */
    @AllowNull(false)
    @Column(DataType.STRING(8192))
    public description!: string;

    /**
     * Link to the image of the company.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public imageUrl!: string;

    /**
     * Email to contact if you want the opportunity.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public contactEmail!: string;

    /**
     * Link to the opportunity on the website of the company.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public link!: string;

    /**
     * Level of education needed for the opportunity
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public educationLevel!: string;

    /**
     * Category of the opportunity
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public category!: string;
}

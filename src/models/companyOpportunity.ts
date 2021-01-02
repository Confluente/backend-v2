import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export class CompanyOpportunity extends Model {
    /**
     * Title of the opportunity.
     */
    @Column(DataType.STRING(128))
    public title!: string;

    /**
     * Name of the company.
     */
    @Column(DataType.STRING(128))
    public companyName!: string;

    /**
     * Description of the opportunity.
     */
    @Column(DataType.STRING(8192))
    public description!: string;

    /**
     * Link to the image of the company.
     */
    @Column(DataType.STRING(128))
    public imageUrl!: string;

    /**
     * Email to contact if you want the opportunity.
     */
    @Column(DataType.STRING(128))
    public contactEmail!: string;

    /**
     * Link to the opportunity on the website of the company.
     */
    @Column(DataType.STRING(128))
    public link!: string;

    /**
     * Level of education needed for the opportunity
     */
    @Column(DataType.STRING(128))
    public educationLevel!: string;

    /**
     * Category of the opportunity
     */
    @Column(DataType.STRING(128))
    public category!: string;
}

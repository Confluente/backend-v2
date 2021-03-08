import {Table, Column, Model, DataType, AllowNull} from 'sequelize-typescript';
import {stringValidation} from "../../helpers/type.validation.helper";


@Table({timestamps: false})
export class CompanyOpportunity extends Model<CompanyOpportunity> {

    /**
     * Title of the opportunity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public title!: string;

    /**
     * Name of the company.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public companyName!: string;

    /**
     * Description of the opportunity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidation},
    })
    public description!: string;

    /**
     * Link to the image of the company.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public imageUrl!: string;

    /**
     * Email to contact if you want the opportunity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public contactEmail!: string;

    /**
     * Link to the opportunity on the website of the company.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public link!: string;

    /**
     * Level of education needed for the opportunity
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public educationLevel!: string;

    /**
     * Category of the opportunity
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public category!: string;
}

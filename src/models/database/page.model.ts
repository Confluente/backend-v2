import {Table, Column, Model, DataType, AllowNull, PrimaryKey, Unique} from 'sequelize-typescript';
import {stringValidation} from "../../helpers/type.validation.helper";

@Table({timestamps: false})
export class Page extends Model {
    /**
     * URL of the page.
     */
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public url!: string;

    /**
     * Title of the page.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public title!: string;

    /**
     * Content of the page in text format.
     */
    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
        validate: {stringValidation},
    })
    public content!: any;

    /**
     * Author of the page.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public author!: string;
}

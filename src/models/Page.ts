import {Table, Column, Model, DataType, AllowNull, PrimaryKey, Unique} from 'sequelize-typescript';

@Table({timestamps: false})
export class Page extends Model {
    /**
     * URL of the page.
     */
    @Column(DataType.STRING(128))
    @PrimaryKey
    @Unique
    @AllowNull(false)
    public url!: string;

    /**
     * Title of the page.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public title!: string;

    /**
     * Content of the page in text format.
     */
    @Column(DataType.TEXT)
    @AllowNull(false)
    public content!: any;

    /**
     * Author of the page.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public author!: string;
}

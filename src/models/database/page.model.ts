import {Table, Column, Model, DataType, AllowNull, PrimaryKey, Unique} from 'sequelize-typescript';

@Table({timestamps: false})
export class Page extends Model {
    /**
     * URL of the page.
     */
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public url!: string;

    /**
     * Title of the page.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public title!: string;

    /**
     * Content of the page in text format.
     */
    @AllowNull(false)
    @Column(DataType.TEXT)
    public content!: any;

    /**
     * Author of the page.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public author!: string;
}

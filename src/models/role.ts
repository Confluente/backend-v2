import {AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";

@Table({timestamps: false})
export class Role extends Model {

    /**
     * Name of the role.
     */
    @Column(DataType.STRING(128))
    @Unique
    @PrimaryKey
    @AllowNull(false)
    public name!: string;

    /**
     * Permission to view pages.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public PAGE_VIEW!: boolean;

    /**
     * Permission to manage pages.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public PAGE_MANAGE!: boolean;

    /**
     * Permission to create users.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public USER_CREATE!: boolean;

    /**
     * Permission to view all users.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public USER_VIEW_ALL!: boolean;

    /**
     * Permission to manage users.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public USER_MANAGE!: boolean;

    /**
     * Permission to change the passwords of all accounts.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public CHANGE_ALL_PASSWORDS!: boolean;

    /**
     * Permission to view roles.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public ROLE_VIEW!: boolean;

    /**
     * Permission to manage roles.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public ROLE_MANAGE!: boolean;

    /**
     * Permission to view published activities.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public ACTIVITY_VIEW_PUBLISHED!: boolean;

    /**
     * Permission to view all unpublished activities.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public ACTIVITY_VIEW_ALL_UNPUBLISHED!: boolean;

    /**
     * Permission to manage activities.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public ACTIVITY_MANAGE!: boolean;
}

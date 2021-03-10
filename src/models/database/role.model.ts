import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Default,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import {User} from "./user.model";

@Table({timestamps: false})
export class Role extends Model {

    /**
     * ID of the role
     */
    @AutoIncrement
    @Unique
    @PrimaryKey
    @Column(DataType.INTEGER)
    public id: number;

    /**
     * Name of the role.
     */
    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public name!: string;

    /**
     * Permission to view pages.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PAGE_VIEW: boolean;

    /**
     * Permission to manage pages.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PAGE_MANAGE: boolean;

    /**
     * Permission to create users.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_CREATE: boolean;

    /**
     * Permission to view all users.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_VIEW_ALL: boolean;

    /**
     * Permission to manage users.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_MANAGE: boolean;

    /**
     * Permission to change the passwords of all accounts.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public CHANGE_ALL_PASSWORDS: boolean;

    /**
     * Permission to view roles.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ROLE_VIEW: boolean;

    /**
     * Permission to manage roles.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ROLE_MANAGE: boolean;

    /**
     * Permission to view groups.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_VIEW: boolean;

    /**
     * Permission to manage groups.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_MANAGE: boolean;

    /**
     * Permission to organize events as any group.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_ORGANIZE_WITH_ALL: boolean;

    /**
     * Permission to view published activities.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_VIEW_PUBLISHED: boolean;

    /**
     * Permission to view all unpublished activities.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_VIEW_ALL_UNPUBLISHED: boolean;

    /**
     * Permission to manage activities.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_MANAGE: boolean;

    /**
     * Permission to manage partners
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PARTNER_MANAGE: boolean;

    /**
     * Permission to view partner content.
     */
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PARTNER_VIEW!: boolean;

    /**
     * Users that have this particular role (one-to-many relation)
     */
    @HasMany(() => User, {})
    public users: User[];
}

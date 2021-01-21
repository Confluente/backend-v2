import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import {User} from "./user.model";
import {Activity} from "./activity.model";

@Table({timestamps: false})
export class Role extends Model<Role> {

    /**
     * ID of the role
     */
    @AllowNull(false)
    @AutoIncrement
    @Unique
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    public id!: number;

    /**
     * Name of the role.
     */
    @Unique
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public name!: string;

    /**
     * Permission to view pages.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PAGE_VIEW!: boolean;

    /**
     * Permission to manage pages.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public PAGE_MANAGE!: boolean;

    /**
     * Permission to create users.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_CREATE!: boolean;

    /**
     * Permission to view all users.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_VIEW_ALL!: boolean;

    /**
     * Permission to manage users.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public USER_MANAGE!: boolean;

    /**
     * Permission to change the passwords of all accounts.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public CHANGE_ALL_PASSWORDS!: boolean;

    /**
     * Permission to view roles.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ROLE_VIEW!: boolean;

    /**
     * Permission to manage roles.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ROLE_MANAGE!: boolean;

    /**
     * Permission to view groups.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_VIEW!: boolean;

    /**
     * Permission to manage groups.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_MANAGE!: boolean;

    /**
     * Permission to organize events as any group.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public GROUP_ORGANIZE_WITH_ALL!: boolean;

    /**
     * Permission to view published activities.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_VIEW_PUBLISHED!: boolean;

    /**
     * Permission to view all unpublished activities.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_VIEW_ALL_UNPUBLISHED!: boolean;

    /**
     * Permission to manage activities.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public ACTIVITY_MANAGE!: boolean;
}

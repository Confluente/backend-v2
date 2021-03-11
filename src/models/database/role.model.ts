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
import {
    booleanValidation,
    numberValidation,
    stringValidation
} from "../../helpers/type.validation.helper";

@Table({timestamps: false})
export class Role extends Model {

    /**
     * ID of the role
     */
    @AutoIncrement
    @Unique
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    public id: number;

    /**
     * Name of the role.
     */
    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public name!: string;

    /**
     * Permission to view pages.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public PAGE_VIEW!: boolean;

    /**
     * Permission to manage pages.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public PAGE_MANAGE: boolean;

    /**
     * Permission to create users.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public USER_CREATE: boolean;

    /**
     * Permission to view all users.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public USER_VIEW_ALL: boolean;

    /**
     * Permission to manage users.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public USER_MANAGE: boolean;

    /**
     * Permission to change the passwords of all accounts.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public CHANGE_ALL_PASSWORDS: boolean;

    /**
     * Permission to view roles.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public ROLE_VIEW: boolean;

    /**
     * Permission to manage roles.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public ROLE_MANAGE: boolean;

    /**
     * Permission to view groups.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public GROUP_VIEW: boolean;

    /**
     * Permission to manage groups.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public GROUP_MANAGE: boolean;

    /**
     * Permission to organize events as any group.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public GROUP_ORGANIZE_WITH_ALL: boolean;

    /**
     * Permission to view published activities.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public ACTIVITY_VIEW_PUBLISHED: boolean;

    /**
     * Permission to view all unpublished activities.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public ACTIVITY_VIEW_ALL_UNPUBLISHED: boolean;

    /**
     * Permission to manage activities.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public ACTIVITY_MANAGE: boolean;

    /**
     * Permission to manage partners
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public PARTNER_MANAGE: boolean;

    /**
     * Permission to view partner content.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public PARTNER_VIEW!: boolean;

    /**
     * Users that have this particular role (one-to-many relation)
     */
    @HasMany(() => User, {})
    public users: User[];
}

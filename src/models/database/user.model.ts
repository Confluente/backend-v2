import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";

import {Group} from './group.model';
import {Activity} from "./activity.model";
import {Role} from "./role.model";
import {Subscription} from "./subscription.model";
import {UserGroup} from "./usergroup.model";

@Table({timestamps: false})
export class User extends Model<User> {

    /**
     * Database id of the user.
     */
    @PrimaryKey
    @AutoIncrement
    @Unique
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    /**
     * Email of the user.
     */
    // TODO Check if we cant better have the db id as the primary key?
    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public email!: string;

    /**
     * First name of the user.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public firstName!: string;

    /**
     * Last name of the user.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public lastName!: string;

    /**
     * Display name of the user.
     * Usually concatenation of first name and last name
     */
        // TODO delete this, and just make a function for get Display Name or smth
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public displayName!: string;

    /**
     * Major of the user
     */
    @Column(DataType.STRING(128))
    public major: string | null;

    /**
     * Stores the address of the user.
     */
    @Column(DataType.STRING(128))
    public address: string | null;

    /**
     * Honors track of the user.
     */
    @Column(DataType.STRING(128))
    public track: string | null;

    /**
     * Year that the user started with honors.
     */
    @Column(DataType.INTEGER)
    public honorsGeneration: number | null;
    
    /**
     * Stores what kind of membership the user has
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public honorsMembership!: string;

    /**
     * Campus card number of the user.
     */
    @Column(DataType.STRING(128))
    public campusCardNumber: string | null;

    /**
     * Mobile phone number of the user.
     */
    @Column(DataType.STRING(128))
    public mobilePhoneNumber: string | null;

    /**
     * Whether the user gave consent regarding portrait right.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public consentWithPortraitRight!: boolean;

    /**
     * Hash of the password of the user.
     */
    @AllowNull(false)
    @Column(DataType.BLOB)
    public passwordHash!: any;

    /**
     * Salt of the password of the user.
     */
    @AllowNull(false)
    @Column(DataType.BLOB)
    public passwordSalt!: any;

    /**
     * Whether the account of the user is approved
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public approved!: boolean;

    /**
     * The hash link via which the account can be approved
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public approvingHash!: string;

    // TODO add nice comments
    @BelongsToMany(() => Group, () => UserGroup)
    public groups: Array<Group & {UserGroup: UserGroup}>;

    @BelongsToMany(() => Activity, () => Subscription)
    public activities: Array<Activity & {Subscript: Subscription}>;

    @ForeignKey(() => Role)
    public role: Role;
}

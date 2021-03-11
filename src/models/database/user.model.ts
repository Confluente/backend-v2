import {
    AllowNull,
    AutoIncrement, BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey, HasOne,
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
import {Session} from "./session.model";
import {
    booleanValidation,
    numberValidation, numberValidationOrNull,
    stringValidation,
    stringValidationOrNull
} from "../../helpers/type.validation.helper";

@Table({timestamps: false})
export class User extends Model {

    /**
     * Database id of the user.
     */
    @PrimaryKey
    @AutoIncrement
    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    public id!: number;

    /**
     * Email of the user.
     */
    @Unique
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public email!: string;

    /**
     * First name of the user.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public firstName!: string;

    /**
     * Last name of the user.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public lastName!: string;

    /**
     * Display name of the user.
     * Usually concatenation of first name and last name
     */
    // TODO delete this, and just make a function for get Display Name or smth
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public displayName!: string;

    /**
     * Major of the user
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public major: string | null;

    /**
     * Stores the address of the user.
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public address: string | null;

    /**
     * Honors track of the user.
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public track: string | null;

    /**
     * Year that the user started with honors.
     */
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidationOrNull}
    })
    public honorsGeneration: number | null;
    
    /**
     * Stores what kind of membership the user has
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public honorsMembership!: string;

    /**
     * Campus card number of the user.
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public campusCardNumber: string | null;

    /**
     * Mobile phone number of the user.
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public mobilePhoneNumber: string | null;

    /**
     * Whether the user gave consent regarding portrait right.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public consentWithPortraitRight: boolean;

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
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public approved: boolean;

    /**
     * The hash link via which the account can be approved
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public approvingHash!: string;

    /**
     * Stores the groups that this user is a member of (many-to-many relation)
     */
    @BelongsToMany(() => Group, () => UserGroup)
    public groups: Array<Group & {UserGroup: UserGroup}>;

    /**
     * Stores the activities that this user is subscribed to (many-to-many relation)
     */
    @BelongsToMany(() => Activity, () => Subscription)
    public activities: Array<Activity & {Subscription: Subscription}>;

    /**
     * Stores the id of the role that this user has.
     */
    @ForeignKey(() => Role)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    public roleId!: number;

    /**
     * Stores the Role that this user has.
     * By including the Role model in your query you can, via this property, directly get and access the role model
     * associated to the user.
     */
    @BelongsTo(() => Role)
    public role!: Role;

    /**
     * Stores the session that belongs to this user (one-to-one relation)
     */
    @HasOne(() => Session, {onDelete: "cascade"})
    public session: Session;
}

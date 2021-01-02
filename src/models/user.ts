import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";

import {Group} from './group';
import {Activity} from "./activity";
import {Role} from "./role";

@Table({timestamps: false})
export class User extends Model {

    /**
     * Database id of the user.
     */
    @Column(DataType.INTEGER.UNSIGNED)
    @AutoIncrement
    @Unique
    @AllowNull(false)
    public id!: number;

    /**
     * Email of the user.
     */
    // TODO Check if we cant better have the db id as the primary key?
    @Column(DataType.STRING(128))
    @PrimaryKey
    @Unique
    @AllowNull(false)
    public email!: string;

    /**
     * First name of the user.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public firstName!: string;

    /**
     * Last name of the user.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public lastName!: string;

    /**
     * Display name of the user.
     * Usually concatenation of first name and last name
     */
        // TODO delete this, and just make a function for get Display Name or smth
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public displayName!: string;

    /**
     * Major of the user
     */
    @Column(DataType.STRING(128))
    public major!: string | null;

    /**
     * Stores the address of the user.
     */
    @Column(DataType.STRING(128))
    public address!: string | null;

    /**
     * Honors track of the user.
     */
    @Column(DataType.STRING(128))
    public track!: string | null;

    /**
     * Year that the user started with honors.
     */
    @Column(DataType.INTEGER)
    public honorsGeneration!: number | null;
    
    /**
     * Stores what kind of membership the user has
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public honorsMembership!: string;

    /**
     * Campus card number of the user.
     */
    @Column(DataType.STRING(128))
    public campusCardNumber!: string | null;

    /**
     * Mobile phone number of the user.
     */
    @Column(DataType.STRING(128))
    public mobilePhoneNumber!: string | null;

    /**
     * Whether the user gave consent regarding portrait right.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public consentWithPortraitRight!: boolean;

    /**
     * Hash of the password of the user.
     */
    @Column(DataType.BLOB)
    @AllowNull(false)
    public passwordHash!: any;

    /**
     * Salt of the password of the user.
     */
    @Column(DataType.BLOB)
    @AllowNull(false)
    public passwordSalt!: any;

    /**
     * Whether the account of the user is approved
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public approved!: boolean;

    /**
     * The hash link via which the account can be approved
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public approvingHash!: string;
}

/**
 * userGroup is the function relating users to groups via userGroup.
 * Function is the function that the user has in the group.
 */
const userGroup: any = db.define('user_group', {
    func: DataTypes.STRING
});

/**
 * subscription is the function relating users to activities via subscriptions.
 * Answers are the answers that the user gave to the questions of the form.
 */
const subscription: any = db.define('subscription', {
    answers: DataTypes.STRING
});

// All relationships defined hereafter are onDelete 'CASCADE' to make sure that when an instance is deleted,
// the relations that instance has to other models are also deleted.

// Relates a user to a group through a userGroup
User.belongsToMany(Group, {as: "groups", through: 'user_group', onDelete: 'CASCADE'});

// Relates a group to a user through userGroup as members
Group.belongsToMany(User, {as: "members", through: userGroup, onDelete: 'CASCADE'});

// Relates a user to an activity trough a subscription
User.belongsToMany(Activity, {through: subscription, onDelete: 'CASCADE'});

// Relates an activity to a user through subscription as participants
Activity.belongsToMany(User, {as: "participants", through: subscription, onDelete: 'CASCADE'});

// User is assigned a single role
User.hasOne(Role, {as: "role"});

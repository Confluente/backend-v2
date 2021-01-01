import {Sequelize, Model, DataTypes} from "sequelize";
import {db} from './db';
const sequelize: Sequelize = db;

import {Group} from './group';
import {Activity} from "./activity";
import {Role} from "./role";

export class User extends Model {
    /**
     * Email of the user.
     */
    public email!: string;

    /**
     * First name of the user.
     */
    public firstName!: string;

    /**
     * Last name of the user.
     */
    public lastName!: string;

    /**
     * Display name of the user.
     * Usually concatenation of first name and last name
     */
    public displayName!: string;

    /**
     * Major of the user
     */
    public major!: string | null;

    /**
     * Stores the address of the user.
     */
    public address!: string | null;

    /**
     * Honors track of the user.
     */
    public track!: string | null;

    /**
     * Year that the user started with honors.
     */
    public honorsGeneration!: number | null;
    
    /**
     * Stores what kind of membership the user has
     */
    public honorsMembership!: string;

    /**
     * Campus card number of the user.
     */
    public campusCardNumber!: string | null;

    /**
     * Mobile phone number of the user.
     */
    public mobilePhoneNumber!: string | null;

    /**
     * Whether the user gave consent regarding portrait right.
     */
    public consentWithPortraitRight!: boolean;

    /**
     * Hash of the password of the user.
     */
    public passwordHash!: any;

    /**
     * Salt of the password of the user.
     */
    public passwordSalt!: any;

    /**
     * Whether the account of the user is approved
     */
    public approved!: boolean;

    /**
     * The hash link via which the account can be approved
     */
    public approvingHash!: string;
}

User.init(
    {
        email: {
            type: new DataTypes.STRING(128),
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        lastName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        displayName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        major: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        address: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        track: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        honorsGeneration: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        honorsMembership: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        campusCardNumber: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        mobilePhoneNumber: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        consentWithPortraitRight: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        passwordHash: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        passwordSalt: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        approvingHash: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "user",
        sequelize,
    }
);

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
User.belongsToMany(Group, {through: userGroup, onDelete: 'CASCADE'});

// Relates a group to a user through userGroup as members
Group.belongsToMany(User, {as: "members", through: userGroup, onDelete: 'CASCADE'});

// Relates a user to an activity trough a subscription
User.belongsToMany(Activity, {through: subscription, onDelete: 'CASCADE'});

// Relates an activity to a user through subscription as participants
Activity.belongsToMany(User, {as: "participants", through: subscription, onDelete: 'CASCADE'});

// User is assigned a single role
User.hasOne(Role);

userGroup.sync();
subscription.sync();
User.sync();
Group.sync();
Activity.sync();
Role.sync();
db.sync();

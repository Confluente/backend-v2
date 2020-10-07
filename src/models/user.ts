const Sequelize = require("sequelize");
const db = require("./db");
const Group = require("./group");
const Activity = require("./activity");


class User extends Sequelize.Model {
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
     * Whether the user is an admin.
     */
    public isAdmin!: boolean;

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
            type: new Sequelize.DataTypes.STRING(128),
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        lastName: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        displayName: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        major: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: true,
        },
        address: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: true,
        },
        track: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: true,
        },
        honorsGeneration: {
            type: new Sequelize.DataTypes.INTEGER(32),
            allowNull: true,
        },
        honorsMembership: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        campusCardNumber: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: true,
        },
        mobilePhoneNumber: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        consentWithPortraitRight: {
            type: new Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        passwordHash: {
            type: new Sequelize.DataTypes.BLOB(),
            allowNull: false,
        },
        passwordSalt: {
            type: new Sequelize.DataTypes.BLOB(),
            allowNull: false,
        },
        isAdmin: {
            type: new Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        approved: {
            type: new Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        approvingHash: {
            type: new Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "users",
        Sequelize,
    }
)

/**
 * UserGroup is the function relating users to groups via UserGroup.
 * Function is the function that the user has in the group.
 */
const UserGroup = db.define('user_group', {
    func: Sequelize.STRING
});

/**
 * Subscription is the function relating users to activities via subscriptions.
 * Answers are the answers that the user gave to the questions of the form.
 */
const Subscription = db.define('subscription', {
    answers: Sequelize.STRING
});

// All relationships defined hereafter are onDelete 'CASCADE' to make sure that when an instance is deleted,
// the relations that instance has to other models are also deleted.

// Relates a user to a group through a UserGroup
User.belongsToMany(Group, {through: UserGroup, onDelete: 'CASCADE'});

// Relates a group to a user through UserGroup as members
Group.belongsToMany(User, {as: "members", through: UserGroup, onDelete: 'CASCADE'});

// Relates a user to an activity trough a subscription
User.belongsToMany(Activity, {through: Subscription, onDelete: 'CASCADE'});

// Relates an activity to a user through subscription as participants
Activity.belongsToMany(User, {as: "participants",through: Subscription, onDelete: 'CASCADE'});

UserGroup.sync();
Subscription.sync();
User.sync();
Group.sync();
Activity.sync();
db.sync();

module.exports = User;

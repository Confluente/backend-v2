import {Model, DataTypes} from "sequelize";

import {Group} from './group';

export class Activity extends Model {
    /**
     * Name of the activity.
     */
    public name!: string;

    /**
     * Description of the activity.
     */
    public description!: string;

    /**
     * Location of the activity.
     */
    public location!: string | null;

    /**
     * Date of the activity.
     */
    public date!: any;

    /**
     * Start time of the activity.
     */
    public startTime!: any | null;

    /**
     * End time of the activity.
     */
    public endTime!: any | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    public participationFee!: number | null;

    /**
     * Number of questions in the subscription form.
     */
    public numberOfQuestions!: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    public typeOfQuestion!: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    public questionDescriptions!: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    public formOptions!: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public required!: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public privacyOfQuestions!: string | null;

    /**
     * Subscription deadline of the activity.
     */
    public subscriptionDeadline!: object | null;

    /**
     * Stores whether the activity is published.
     */
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    public hasCoverImage!: boolean;
}

Activity.init(
    {
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: new DataTypes.STRING(8192),
            allowNull: false,
        },
        location: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
        date: {
            type: new DataTypes.DATE(),
            allowNull: false,
        },
        startTime: {
            type: new DataTypes.TIME(),
            allowNull: true,
        },
        endTime: {
            type: new DataTypes.TIME(),
            allowNull: true,
        },
        canSubscribe: {
            type: new DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: false,
        },
        participationFee: {
            type: new DataTypes.DECIMAL(),
            allowNull: true,
        },
        numberOfQuestions: {
            type: new DataTypes.INTEGER(),
            allowNull: true,
        },
        typeOfQuestion: {
            type: new DataTypes.STRING(1024),
            allowNull: true,
        },
        questionDescriptions: {
            type: new DataTypes.STRING(8192),
            allowNull: true,
        },
        formOptions: {
            type: new DataTypes.STRING(8192),
            allowNull: true,
        },
        required: {
            type: new DataTypes.STRING(8192),
            allowNull: true,
        },
        privacyOfQuestions: {
            type: new DataTypes.STRING(8192),
            allowNull: true,
        },
        subscriptionDeadline: {
            type: new DataTypes.DATE(),
            allowNull: true,
        },
        published: {
            type: new DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: false,
        },
        hasCoverImage: {
            type: new DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "activity",
        Sequelize,
    }
);

// Relates activities to a group that organizes the activity.
Activity.Organizer = Activity.belongsTo(Group, {as: "Organizer", onDelete: 'CASCADE'});

Activity.sync();
Group.sync();
db.sync();

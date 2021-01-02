import {Table, Column, Model, DataType, AllowNull, Default} from 'sequelize-typescript';

import {Group} from './group';

@Table({
    timestamps: false
})
export class Activity extends Model {
    /**
     * Name of the activity.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public name!: string;

    /**
     * Description of the activity.
     */
    @Column(DataType.STRING(8192))
    @AllowNull(false)
    public description!: string;

    /**
     * Location of the activity.
     */
    @Column(DataType.STRING(128))
    public location!: string | null;

    /**
     * Date of the activity.
     */
    @Column(DataType.DATE)
    @AllowNull(false)
    public date!: any;

    /**
     * Start time of the activity.
     */
    @Column(DataType.TIME)
    public startTime!: any | null;

    /**
     * End time of the activity.
     */
    @Column(DataType.TIME)
    public endTime!: any | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    @Column(DataType.DECIMAL)
    public participationFee!: number | null;

    /**
     * Number of questions in the subscription form.
     */
    @Column(DataType.INTEGER.UNSIGNED)
    public numberOfQuestions!: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    @Column(DataType.STRING(1024))
    public typeOfQuestion!: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    @Column(DataType.STRING(8192))
    public questionDescriptions!: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    @Column(DataType.STRING(8192))
    public formOptions!: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column(DataType.STRING(8192))
    public required!: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column(DataType.STRING(8192))
    public privacyOfQuestions!: string | null;

    /**
     * Subscription deadline of the activity.
     */
    @Column(DataType.TIME)
    public subscriptionDeadline!: object | null;

    /**
     * Stores whether the activity is published.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    @Default(false)
    public hasCoverImage!: boolean;
}

// Relates activities to a group that organizes the activity.
// TODO redo this
Activity.belongsTo(Group, {as: "Organizer", onDelete: 'CASCADE'});

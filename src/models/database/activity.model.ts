import {
    Table,
    Column,
    DataType,
    AllowNull,
    Default,
    BelongsToMany,
    Model, ForeignKey
} from 'sequelize-typescript';

import {Group} from './group.model';
import {User} from "./user.model";
import {Subscription} from "./subscription.model";

@Table({
    timestamps: false
})
export class Activity extends Model {

    /**
     * Name of the activity.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public name!: string;

    /**
     * Description of the activity.
     */
    @AllowNull(false)
    @Column(DataType.STRING(8192))
    public description!: string;

    /**
     * Location of the activity.
     */
    @Column(DataType.STRING(128))
    public location!: string | null;

    /**
     * Date of the activity.
     */
    @AllowNull(false)
    @Column(DataType.DATE)
    public date!: any;

    /**
     * Start time of the activity.
     */
    @Column(DataType.TIME)
    public startTime: any | null;

    /**
     * End time of the activity.
     */
    @Column(DataType.TIME)
    public endTime: any | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    @Column(DataType.DECIMAL)
    public participationFee: number | null;

    /**
     * Number of questions in the subscription form.
     */
    @Column(DataType.INTEGER)
    public numberOfQuestions: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    @Column(DataType.STRING(1024))
    public typeOfQuestion: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    @Column(DataType.STRING(8192))
    public questionDescriptions: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    @Column(DataType.STRING(8192))
    public formOptions: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column(DataType.STRING(8192))
    public required: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column(DataType.STRING(8192))
    public privacyOfQuestions: string | null;

    /**
     * Subscription deadline of the activity.
     */
    @Column(DataType.TIME)
    public subscriptionDeadline: any | null;

    /**
     * Stores whether the activity is published.
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    public hasCoverImage!: boolean;

    // TODO add comments
    @BelongsToMany(() => User, () => Subscription)
    public participants: Array<User & {Subscription: Subscription}>;

    // TODO change uses of this (was first capitalized)
    // TODO maybe change to HasOne relationship, as i feel like that makes more sense
    @ForeignKey(() => Group)
    public organizer: Group;
}

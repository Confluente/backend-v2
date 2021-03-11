import {
    Table,
    Column,
    DataType,
    AllowNull,
    Default,
    BelongsToMany,
    Model, ForeignKey, BelongsTo
} from 'sequelize-typescript';

import {Group} from './group.model';
import {User} from "./user.model";
import {Subscription} from "./subscription.model";
import {
    booleanValidation, numberValidation, numberValidationOrNull,
    stringValidation,
    stringValidationOrNull
} from "../../helpers/type.validation.helper";

@Table({
    timestamps: false
})
export class Activity extends Model {

    /**
     * Name of the activity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public name!: string;

    /**
     * Description of the activity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    public description!: string;

    /**
     * Location of the activity.
     */
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    public location: string | null;

    /**
     * Date of the activity.
     */
    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        validate: {isDate: true}
    })
    public date!: any;

    /**
     * Start time of the activity.
     */
    @Column({
        type: DataType.STRING,
        validate: {stringValidationOrNull},
    })
    public startTime: string | null;

    /**
     * End time of the activity.
     */
    @Column({
        type: DataType.STRING,
        validate: {stringValidationOrNull},
    })
    public endTime: string | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public canSubscribe: boolean;

    /**
     * Participation fee of the activity.
     */
    @Column({
        type: DataType.DECIMAL,
        validate: {numberValidationOrNull}
    })
    public participationFee: number | null;

    /**
     * Number of questions in the subscription form.
     */
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidationOrNull}
    })
    public numberOfQuestions: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    @Column({
        type: DataType.STRING(1024),
        validate: {stringValidationOrNull},
    })
    public typeOfQuestion: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    public questionDescriptions: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    public formOptions: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    public required: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    public privacyOfQuestions: string | null;

    /**
     * Subscription deadline of the activity.
     */
    @Column({
        type: DataType.DATE,
        validate: {isDate: true}
    })
    public subscriptionDeadline: any | null;

    /**
     * Stores whether the activity is published.
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    @Default(false)
    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
        validate: {booleanValidation}
    })
    public hasCoverImage: boolean;

    /**
     * Stores the users that have subscribed to this event (many-to-many relation)
     */
    @BelongsToMany(() => User, () => Subscription)
    public participants: Array<User & {Subscription: Subscription}>;

    /**
     * Stores the id of the group that organizes this activity
     */
    @ForeignKey(() => Group)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    public organizerId!: number;

    /**
     * Stores the Group that organizes this activity.
     * By including the Group model in your query you can, via this property, directly get and access the group model
     * associated to this activity.
     */
    @BelongsTo(() => Group)
    public organizer: Group;
}

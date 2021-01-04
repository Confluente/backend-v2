import {Group} from "../database/group.model";
import {Activity} from "../database/activity.model";
import marked from "marked";
import {SubscriptionWeb} from "./subscription.web.model";

export class ActivityWeb {

    constructor(activity: Activity) {
        this.name = activity.name;
        this.description = activity.description;
        this.description_html = marked(this.description || "");
        this.location = activity.location;
        this.date = activity.date;
        this.startTime = activity.startTime;
        this.endTime = activity.endTime;
        this.canSubscribe = activity.canSubscribe;
        this.participationFee = activity.participationFee;
        this.numberOfQuestions = activity.numberOfQuestions;
        this.typeOfQuestion = activity.typeOfQuestion;
        this.questionDescriptions = activity.questionDescriptions;
        this.formOptions = activity.formOptions;
        this.required = activity.required;
        this.privacyOfQuestions = activity.privacyOfQuestions;
        this.subscriptionDeadline = activity.subscriptionDeadline;
        this.published = activity.published;
        this.hasCoverImage = activity.hasCoverImage;
        this.participants = activity.participants;
        this.organizer = activity.organizer;
    }

    /**
     * ID of the activity
     * Can be empty if it is to be defined by the database yet
     */
    public id: string | null;

    /**
     * Name of the activity.
     */
    public name!: string;

    /**
     * Description of the activity.
     */
    public description!: string;

    /**
     * Marked (html) description of the activity.
     */
    public description_html: string;

    /**
     * Location of the activity.
     */
    public location: string | null;

    /**
     * Date of the activity.
     */
    public date!: any;

    /**
     * Start time of the activity.
     */
    public startTime: any | null;

    /**
     * End time of the activity.
     */
    public endTime: any | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    public participationFee: number | null;

    /**
     * Number of questions in the subscription form.
     */
    public numberOfQuestions: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    public typeOfQuestion: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    public questionDescriptions: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    public formOptions: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public required: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public privacyOfQuestions: string | null;

    /**
     * Subscription deadline of the activity.
     */
    public subscriptionDeadline: object | null;

    /**
     * Stores whether the activity is published.
     */
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    public hasCoverImage!: boolean;

    // TODO add comments
    public participants!: SubscriptionWeb[];

    // TODO change uses of this (was first capitalized)
    // TODO maybe change to HasOne relationship, as i feel like that makes more sense
    public organizer!: Group;

    // TODO Add comments
    public static arrayOfActivityToWeb(activities: Activity[]): ActivityWeb[] {
        const transformedActivities: ActivityWeb[] = [];

        for (const activity of activities) {
            transformedActivities.push(new ActivityWeb(activity));
        }

        return transformedActivities;
    }
}

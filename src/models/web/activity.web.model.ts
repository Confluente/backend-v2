import {Activity} from "../database/activity.model";
import marked from "marked";
import {SubscriptionWeb} from "./subscription.web.model";
import {GroupWeb} from "./group.web.model";
import {copyMatchingSourceKeyValues} from "../../helpers/modelCopyHelper";
import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";

enum questionType {"☰ text", "◉ multiple choice", "☑ checkboxes"}

// TODO check comments on this model
export class ActivityWeb extends AbstractWebModel {

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
    public typeOfQuestion: questionType[];

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    public questionDescriptions: string[];

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    public formOptions: string[][];

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public required: boolean[];

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public privacyOfQuestions: boolean[];

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
    public participants: SubscriptionWeb[];

    // TODO change uses of this (was first capitalized)
    // TODO maybe change to HasOne relationship, as i feel like that makes more sense
    public organizer: GroupWeb;

    // TODO Add comments
    public static getWebModelFromDbModel(dbActivity: Model): ActivityWeb {
        let webActivity = new ActivityWeb();
        webActivity = copyMatchingSourceKeyValues(webActivity, dbActivity);

        webActivity.description_html = marked(webActivity.description || "");

        return webActivity;
    }
}

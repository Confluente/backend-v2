import marked from "marked";
import {SubscriptionWeb} from "./subscription.web.model";
import {GroupWeb} from "./group.web.model";
import {copyMatchingSourceKeyValues} from "../../helpers/model.copy.helper";
import {AbstractWebModel} from "./abstract.web.model";
import {Model, Sequelize} from "sequelize-typescript";
import {Activity} from "../database/activity.model";
import {destringifyStringifiedArrayOfStrings, stringifyArrayOfStrings} from "../../helpers/array.helper";
import * as fs from "fs";
import {pathToActPictures} from "../../constants";
import {UserWeb} from "./user.web.model";

enum questionType {"☰ text", "◉ multiple choice", "☑ checkboxes"}

// TODO check comments on this model
export class ActivityWeb extends AbstractWebModel {

    /**
     * ID of the activity
     * Can be empty if it is to be defined by the database yet
     * TODO check if it can indeed be null?
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
    public startTime: Date | null;

    /**
     * End time of the activity.
     */
    public endTime: Date | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    public participationFee: number;

    /**
     * Number of questions in the subscription form.
     */
    public numberOfQuestions: number;

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
    public subscriptionDeadline: Date | null;

    /**
     * Stores whether the activity is published.
     */
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    public hasCoverImage!: boolean;

    /**
     * Stores the name of the cover image
     */
    public coverImage: string;

        // TODO add comments
    public participants: SubscriptionWeb[];

    // TODO change uses of this (was first capitalized)
    // TODO maybe change to HasOne relationship, as i feel like that makes more sense
    public organizer: GroupWeb;

    public static getWebModelFromDbModel(dbActivity: Model): ActivityWeb {
        // for each attribute where the type and name are equal, copy them over
        const webActivity = copyMatchingSourceKeyValues(new ActivityWeb(), dbActivity);

        // Cast activity to Activity model
        const castedAct = dbActivity as Activity;

        // TODO check whether this works
        webActivity.startTime = castedAct.startTime !== null ? new Date(castedAct.startTime) : null;
        webActivity.endTime = castedAct.endTime !== null ? new Date(castedAct.endTime) : null;

        if ('canSubscribe' in castedAct && castedAct.canSubscribe) {
            webActivity.subscriptionDeadline = castedAct.subscriptionDeadline !== null
                ? new Date(castedAct.subscriptionDeadline) : null;
            webActivity.typeOfQuestion = destringifyStringifiedArrayOfStrings(castedAct.typeOfQuestion);
            webActivity.questionDescriptions = destringifyStringifiedArrayOfStrings(castedAct.questionDescriptions);
            // TODO check if we can cast these immediately to boolean lists?
            webActivity.required = destringifyStringifiedArrayOfStrings(castedAct.required);
            webActivity.privacyOfQuestions = destringifyStringifiedArrayOfStrings(castedAct.privacyOfQuestions);

            const nonSplitFormOptions = destringifyStringifiedArrayOfStrings(castedAct.formOptions);
            webActivity.formOptions = [];
            nonSplitFormOptions.forEach(function(question: string): void {
                webActivity.formOptions.push(question.split('#;#'));
            });

            // Fill participants
            webActivity.participants = [];
            if (castedAct.participants !== null) {
                for (const member of castedAct.participants) {
                    const answers = member.Subscription.answers;
                    delete member.Subscription;
                    const user = UserWeb.getWebModelFromDbModel(member);
                    webActivity.participants.push(new SubscriptionWeb(user, webActivity, answers));
                }
            }
        }

        webActivity.organizer = GroupWeb.getWebModelFromDbModel(castedAct.organizer);

        // Save the name of the cover image
        if (castedAct.hasCoverImage) {
            const files = fs.readdirSync(pathToActPictures);
            for (const file of files) {
                if (file.split(".")[0].toString() === castedAct.id.toString()) {
                    webActivity.coverImage = file;
                }
            }
        }

        // turn the description into html
        webActivity.description_html = marked(webActivity.description || "");

        // return webActivity object
        return webActivity;
    }
}

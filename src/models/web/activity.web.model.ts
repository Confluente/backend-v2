import marked from "marked";
import {SubscriptionWeb} from "./subscription.web.model";
import {GroupWeb} from "./group.web.model";
import {copyMatchingSourceKeyValues} from "../../helpers/web.model.copy.helper";
import {AbstractWebModel} from "./abstract.web.model";
import {Model, Sequelize} from "sequelize-typescript";
import {Activity} from "../database/activity.model";
import {destringifyStringifiedArrayOfStrings} from "../../helpers/array.helper";
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
    public date!: Date;

    /**
     * Start time of the activity.
     */
    public startTime: string | null;

    /**
     * End time of the activity.
     */
    public endTime: string | null;

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

    /**
     * Stores the users that have subscribed to this event as SubscriptionWeb objects.
     */
    public participants: SubscriptionWeb[];

    /**
     * Stores a GroupWeb object representing the group that organizes this event.
     */
    public organizer!: GroupWeb;

    public static async getArrayOfWebModelsFromArrayOfDbModels(dbModels: Model[]): Promise<ActivityWeb[]> {
        const transformed: ActivityWeb[] = [];

        for (const obj of dbModels) {
            await this.getWebModelFromDbModel(obj).then(function(aw: ActivityWeb): void {
                transformed.push(aw);
            });
        }

        return transformed;
    }

    public static async getWebModelFromDbModel(dbActivity: Model): Promise<ActivityWeb> {
        if (!(dbActivity instanceof Activity)) {
            throw new Error("activity.web.model.getWebModelFromDbModel: dbActivity was not an Activity instance");
        }

        // for each attribute where the type and name are equal, copy them over
        // @ts-ignore
        const webActivity = copyMatchingSourceKeyValues(new ActivityWeb(), dbActivity.dataValues);

        // Cast activity to Activity model
        const castedAct = dbActivity as Activity;

        if ('canSubscribe' in castedAct && castedAct.canSubscribe) {
            webActivity.subscriptionDeadline = castedAct.subscriptionDeadline !== null
                ? new Date(castedAct.subscriptionDeadline) : null;

            if (castedAct.typeOfQuestion !== undefined) {
                webActivity.typeOfQuestion = destringifyStringifiedArrayOfStrings(castedAct.typeOfQuestion);
            }

            if (castedAct.questionDescriptions !== undefined) {
                webActivity.questionDescriptions = destringifyStringifiedArrayOfStrings(castedAct.questionDescriptions);
            }

            if (castedAct.required !== undefined) {
                webActivity.required = destringifyStringifiedArrayOfStrings(castedAct.required)
                    .map((el: string) => (el === 'true'));
            }

            if (castedAct.privacyOfQuestions !== undefined) {
                webActivity.privacyOfQuestions = destringifyStringifiedArrayOfStrings(castedAct.privacyOfQuestions)
                    .map((el: string) => (el === 'true'));
            }

            if (castedAct.formOptions !== undefined) {
                const nonSplitFormOptions = destringifyStringifiedArrayOfStrings(castedAct.formOptions);

                webActivity.formOptions = [];
                nonSplitFormOptions.forEach(function(question: string): void {
                    webActivity.formOptions.push(question.split('#;#'));
                });
            }

            // Fill participants
            webActivity.participants = [];
            if (castedAct.participants !== null) {
                for (const member of castedAct.participants) {
                    const answers = destringifyStringifiedArrayOfStrings(member.Subscription.answers);
                    delete member.Subscription;
                    await UserWeb.getWebModelFromDbModel(member).then(function(user: UserWeb): void {
                        webActivity.participants.push(new SubscriptionWeb(user, null, answers));
                    });
                }
            }
        }

        if (castedAct.organizer !== undefined) {
            await GroupWeb.getWebModelFromDbModel(castedAct.organizer).then(function(gw: GroupWeb): void {
                webActivity.organizer = gw;
            });
        }

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

    public getCopyable(): string[] {
        return ["id", "name", "description", "location", "canSubscribe", "participationFee", "numberOfQuestions", "published", "hasCoverImage", "startTime", "endTime"];
    }
}

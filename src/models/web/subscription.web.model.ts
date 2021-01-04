import {ActivityWeb} from "./activity.web.model";
import {UserWeb} from "./user.web.model";

/**
 * subscription is the function relating users to activities via subscriptions.
 * Answers are the answers that the user gave to the questions of the form.
 */
// TODO add comments to this :)
export  class SubscriptionWeb {

    user!: UserWeb;

    activity!: ActivityWeb;

    answers!: string;
}

import {ActivityWeb} from "./activity.web.model";
import {UserWeb} from "./user.web.model";

/**
 * Web representation object for subscription table.
 */
export  class SubscriptionWeb {

    constructor(user: UserWeb, activity: ActivityWeb, answers: string) {
        this.user = user;
        this.activity = activity;
        this.answers = answers;
    }

    user!: UserWeb;

    activity!: ActivityWeb;

    answers!: string;
}

import {UserWeb} from "./user.web.model";
import {GroupWeb} from "./group.web.model";

/**
 * Web representation of the usergroup model
 */
export class UserGroupWeb {

    constructor(user: UserWeb, group: GroupWeb, func: string) {
        this.user = user;
        this.group = group;
        this.func = func;
    }

    user!: UserWeb;

    group!: GroupWeb;

    func!: string;
}

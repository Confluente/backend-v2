import {UserWeb} from "./user.web.model";
import {GroupWeb} from "./group.web.model";

/**
 * userGroup is the function relating users to groups via userGroup.
 * Function is the function that the user has in the group.
 */
// TODO add comments to this :)
export class UserGroupWeb {

    user!: UserWeb;

    group!: GroupWeb;

    func!: string;
}

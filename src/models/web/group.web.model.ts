import {UserWeb} from "./user.web.model";
import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/modelCopyHelper";
import {UserGroupWeb} from "./usergroup.web.model";
import {Group} from "../database/group.model";

export class GroupWeb extends AbstractWebModel {

    /**
     * Database ID of the group
     * Can be empty if it is to be defined by the database yet.
     */
    public id: number;

    /**
     * Display name of the group (shorter than fullName but identifiable).
     */
    public displayName!: string;

    /**
     * Full name of the group.
     */
    public fullName!: string;

    /**
     * Description of the group.
     */
    public description!: string;

    /**
     * Whether the group can organize activities.
     */
    public canOrganize!: boolean;

    /**
     * The email address of the group.
     */
    public email!: string;

    /**
     * The type of the group.
     */
    public type!: string;

    // TODO add comment
    public members!: UserGroupWeb[];

    public static getWebModelFromDbModel(dbGroup: Model): GroupWeb {
        const webGroup = copyMatchingSourceKeyValues(new GroupWeb(), dbGroup);

        webGroup.members = [];
        const group = webGroup.copy();
        for (const member of (dbGroup as Group).members) {
            const func = member.UserGroup.func;
            delete member.UserGroup;
            const user = UserWeb.getWebModelFromDbModel(member);
            webGroup.members.push(new UserGroupWeb(user, group, func));

        }

        return webGroup;
    }
}

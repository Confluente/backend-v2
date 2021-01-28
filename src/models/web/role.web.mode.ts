import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/model.copy.helper";
import {AbstractWebModel} from "./abstract.web.model";

export class RoleWeb extends AbstractWebModel {

    /**
     * Name of the role.
     */
    public name!: string;

    /**
     * Permission to view pages.
     */
    public PAGE_VIEW!: boolean;

    /**
     * Permission to manage pages.
     */
    public PAGE_MANAGE!: boolean;

    /**
     * Permission to create users.
     */
    public USER_CREATE!: boolean;

    /**
     * Permission to view all users.
     */
    public USER_VIEW_ALL!: boolean;

    /**
     * Permission to manage users.
     */
    public USER_MANAGE!: boolean;

    /**
     * Permission to change the passwords of all accounts.
     */
    public CHANGE_ALL_PASSWORDS!: boolean;

    /**
     * Permission to view roles.
     */
    public ROLE_VIEW!: boolean;

    /**
     * Permission to manage roles.
     */
    public ROLE_MANAGE!: boolean;

    /**
     * Permission to view groups.
     */
    public GROUP_VIEW!: boolean;

    /**
     * Permission to manage groups.
     */
    public GROUP_MANAGE!: boolean;

    /**
     * Permission to organize events as any group.
     */
    public GROUP_ORGANIZE_WITH_ALL!: boolean;

    /**
     * Permission to view published activities.
     */
    public ACTIVITY_VIEW_PUBLISHED!: boolean;

    /**
     * Permission to view all unpublished activities.
     */
    public ACTIVITY_VIEW_ALL_UNPUBLISHED!: boolean;

    /**
     * Permission to manage activities.
     */
    public ACTIVITY_MANAGE!: boolean;

    public static getWebModelFromDbModel(dbRole: Model): RoleWeb {
        return copyMatchingSourceKeyValues(new RoleWeb(), dbRole);
    }
}

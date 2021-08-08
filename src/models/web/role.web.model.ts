import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/web.model.copy.helper";
import {AbstractWebModel} from "./abstract.web.model";
import {Role} from "../database/role.model";

export class RoleWeb extends AbstractWebModel {

    /**
     * ID of the role in the database.
     */
    public id: number;

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

    /**
     * Permission to manage partners.
     */
    public PARTNER_MANAGE!: boolean;

    /**
     * Permission to view partner content.
     */
    public PARTNER_VIEW!: boolean;

    public static async getWebModelFromDbModel(dbRole: Model): Promise<RoleWeb> {
        if (!(dbRole instanceof Role)) {
            throw new Error("role.web.model.getWebModelFromDbModel: dbRole was not a Role instance.");
        }

        // @ts-ignore
        return copyMatchingSourceKeyValues(new RoleWeb(), dbRole.dataValues);
    }

    public getCopyable(): string[] {
        return ["id", "name", "PAGE_VIEW", "PAGE_MANAGE", "USER_CREATE", "USER_VIEW_ALL", "USER_MANAGE", "CHANGE_ALL_PASSWORDS", "ROLE_VIEW", "ROLE_MANAGE", "GROUP_VIEW", "GROUP_MANAGE", "GROUP_ORGANIZE_WITH_ALL", "ACTIVITY_VIEW_PUBLISHED", "ACTIVITY_VIEW_ALL_UNPUBLISHED", "ACTIVITY_MANAGE"];
    }
}

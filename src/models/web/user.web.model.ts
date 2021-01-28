import {RoleWeb} from "./role.web.mode";
import {UserGroupWeb} from "./usergroup.web.model";
import {SubscriptionWeb} from "./subscription.web.model";
import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/model.copy.helper";
import {Role} from "../database/role.model";
import {User} from "../database/user.model";

export class UserWeb extends AbstractWebModel {

    /**
     * Database id of the user.
     */
    public id: number;

    /**
     * Email of the user.
     */
    public email!: string;

    /**
     * First name of the user.
     */
    public firstName: string;

    /**
     * Last name of the user.
     */
    public lastName: string;

    /**
     * Display name of the user.
     * Usually concatenation of first name and last name
     */
        // TODO delete this, and just make a function for get Display Name or smth
    public displayName: string;

    /**
     * Major of the user
     */
    public major: string | null;

    /**
     * Stores the address of the user.
     */
    public address: string | null;

    /**
     * Honors track of the user.
     */
    public track: string | null;

    /**
     * Year that the user started with honors.
     */
    public honorsGeneration: number | null;

    /**
     * Stores what kind of membership the user has
     */
    public honorsMembership: string;

    /**
     * Campus card number of the user.
     */
    public campusCardNumber: string | null;

    /**
     * Mobile phone number of the user.
     */
    public mobilePhoneNumber: string | null;

    /**
     * Whether the account of the user is approved
     */
    public approved: boolean;

    /**
     * The hash link via which the account can be approved
     */
    public approvingHash: string;

    /**
     * Whether this user can organize events
     */
    public canOrganize: boolean;

        // TODO add nice comments
    public groups: UserGroupWeb[];

    public activities: SubscriptionWeb[];

    public role: RoleWeb;

    public static getWebModelFromDbModel(dbUser: Model): UserWeb {
        const webUser = copyMatchingSourceKeyValues(new UserWeb(), dbUser);

        if ((dbUser as User).roleId !== null) {
            Role.findByPk((dbUser as User).roleId).then(function(role: Role): void {
                webUser.role = RoleWeb.getWebModelFromDbModel(role);
            });
        }

        webUser.canOrganize = webUser.role.ACTIVITY_MANAGE || webUser.groups.some(
            function(groupOfUser: UserGroupWeb): boolean {
                return groupOfUser.group.canOrganize;
        });

        return webUser;
    }
}

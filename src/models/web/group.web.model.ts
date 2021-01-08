import {UserWeb} from "./user.web.model";
import {AbstractWebModel} from "./abstract.web.model";
import {Model} from "sequelize-typescript";
import {copyMatchingSourceKeyValues} from "../../helpers/modelCopyHelper";

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
    public members!: UserWeb[];

    public static getWebModelFromDbModel(dbGroup: Model): GroupWeb {
        let webGroup = copyMatchingSourceKeyValues(new GroupWeb(), dbGroup);

        return webGroup;
    }
}

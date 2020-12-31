import {stringifyDictionaryOfBooleans} from "../helpers/dictionaryHelper";

export class Role extends sequelize.Model {
    /**
     * Name of the role.
     */
    public name!: string;

    /**
     * Stringified dictionary of permissions associated to the role.
     */
    public permissions!: string;
}

const defaultPermissions = {
    // Pages
    PAGE_VIEW: true,
    PAGE_MANAGE: false,
    // Users
    USER_CREATE: true,
    USER_VIEW_ALL: false,
    USER_MANAGE: false,
    CHANGE_ALL_PASSWORDS: false,
    // Roles
    ROLE_VIEW: false,
    ROLE_MANAGE: false,
    // Groups
    GROUP_VIEW: true,
    GROUP_MANAGE: false,
    GROUP_ORGANIZE_WITH_ALL: false,
    // Activities
    ACTIVITY_VIEW_PUBLISHED: true,
    ACTIVITY_VIEW_ALL_UNPUBLISHED: false,
    ACTIVITY_MANAGE: false
};

Role.init(
    {
        name: {
            type: new sequelize.DataTypes.STRING(128),
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        permissions: {
            type: new sequelize.DataTypes.STRING(1024),
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: stringifyDictionaryOfBooleans(defaultPermissions),
        }
    }
);

Role.sync();

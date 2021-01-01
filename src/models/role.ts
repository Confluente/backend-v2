import {Sequelize, Model, DataTypes} from "sequelize";
import {db} from './db';
const sequelize: Sequelize = db;

export class Role extends Model {
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
}

Role.init(
    {
        name: {
            type: new DataTypes.STRING(128),
            unique: true,
            primaryKey: true,
            allowNull: false,
        },
        PAGE_VIEW: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        PAGE_MANAGE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        USER_CREATE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        USER_VIEW_ALL: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        USER_MANAGE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        CHANGE_ALL_PASSWORDS: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        ROLE_VIEW: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        ROLE_MANAGE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        GROUP_VIEW: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        GROUP_MANAGE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        GROUP_ORGANIZE_WITH_ALL: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        ACTIVITY_VIEW_PUBLISHED: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        ACTIVITY_VIEW_ALL_UNPUBLISHED: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
        ACTIVITY_MANAGE: {
            type: DataTypes.BOOLEAN,
            unique: false,
            primaryKey: false,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: "role",
        sequelize,
    }
);

Role.sync();

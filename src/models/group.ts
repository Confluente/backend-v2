import {
    Sequelize,
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin, Association
} from "sequelize";
import {db} from './db';
import {User} from "./user";
const sequelize: Sequelize = db;

export class Group extends Model {

    public static associations: {
        members: Association<Group, User>;
    };

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

    public addUser!: BelongsToManyAddAssociationMixin<User, string>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
}

Group.init(
    {
        displayName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        fullName: {
            type: new DataTypes.STRING(128),
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        description: {
            type: new DataTypes.STRING(2048),
            allowNull: false,
        },
        canOrganize: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        type: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "group",
        sequelize,
    }
);

Group.sync();

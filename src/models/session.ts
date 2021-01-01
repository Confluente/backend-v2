import {Model, DataTypes} from "sequelize";

export class Session extends Model {
    /**
     * Token of the session.
     */
    public token!: any;

    /**
     * Id of the user of the session.
     */
    public user!: number;

    /**
     * IP address of the user.
     */
    public ip!: string;

    /**
     * Expiration date of the session.
     */
    public expires!: any;
}

Session.init(
    {
        token: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        user: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        ip: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: "session",
        sequelize,
    }
);

Session.sync();

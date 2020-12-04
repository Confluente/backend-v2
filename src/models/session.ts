class Session extends sequelize.Model {
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
            type: new sequelize.DataTypes.BLOB(),
            allowNull: false,
        },
        user: {
            type: new sequelize.DataTypes.BLOB(),
            allowNull: false,
        },
        ip: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        expires: {
            type: new sequelize.DataTypes.DATE(),
            allowNull: false,
        }
    },
    {
        tableName: "session",
        sequelize,
    }
);

Session.sync();

module.exports = Session;

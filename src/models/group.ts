class Group extends sequelize.Model {
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
}

Group.init(
    {
        displayName: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        fullName: {
            type: new sequelize.DataTypes.STRING(128),
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        description: {
            type: new sequelize.DataTypes.STRING(2048),
            allowNull: false,
        },
        canOrganize: {
            type: new sequelize.DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: false,
        },
        email: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        type: {
            type: new sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "group",
        sequelize,
    }
);

Group.sync();

module.exports = Group;

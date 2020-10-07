class Activity extends sequelize.Model {
    /**
     * Name of the activity.
     */
    public name!: string;

    /**
     * Description of the activity.
     */
    public description!: string;

    /**
     * Location of the activity.
     */
    public location!: string | null;

    /**
     * Date of the activity.
     */
    public date!: any;

    /**
     * Start time of the activity.
     */
    public startTime!: any | null;

    /**
     * End time of the activity.
     */
    public endTime!: any | null;

    /**
     * canSubscribes stores whether members can subscribe to the activity.
     */
    public canSubscribe!: boolean;

    /**
     * Participation fee of the activity.
     */
    public participationFee!: number | null;

    /**
     * Number of questions in the subscription form.
     */
    public numberOfQuestions!: number | null;

    /**
     * Type of questions in the subscription form.
     * For every question the string stores whether the question is text, multiple choice or checkboxes.
     * Types are separated by #,# delimiter.
     */
    public typeOfQuestion!: string | null;

    /**
     * Questions of the subscription form.
     * For every question the string stores the description (actual question).
     * Descriptions are separated by #,# delimiter.
     */
    public questionDescriptions!: string | null;

    /**
     * Options for multiple choice and checkbox questions in form.
     * For every question the string stores the options.
     * Options of different questions are separated by #,#.
     * Options for the same question are separated by #;#.
     */
    public formOptions!: string | null;

    /**
     * Which questions are required.
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public required!: string | null;

    /**
     * Which questions are private (answers of private questions do not show to everyone).
     * For every question the string stores true or false.
     * Separated by #,#.
     */
    public privacyOfQuestions!: string | null;

    /**
     * Subscription deadline of the activity.
     */
    public subscriptionDeadline!: object | null;

    /**
     * Stores whether the activity is published.
     */
    public published!: boolean;

    /**
     * Stores whether the activity has a cover image
     */
    public hasCoverImage!: boolean;
}

Activity.init(
    {
        name: {
            type: new sequelize.DataType.STRING(128),
            allowNull: false,
        },
        description: {
            type: new sequelize.DataType.STRING(8192),
            allowNull: false,
        },
        location: {
            type: new sequelize.DataType.STRING(128),
            allowNull: true,
        },
        date: {
            type: new sequelize.DataType.DATE,
            allowNull: false,
        },
        startTime: {
            type: new sequelize.DataType.TIME,
            allowNull: true,
        },
        endTime: {
            type: new sequelize.DataType.TIME,
            allowNull: true,
        },
        canSubscribe: {
            type: new sequelize.DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        participationFee: {
            type: new sequelize.DataType.DECIMAL,
            allowNull: true,
        },
        numberOfQuestions: {
            type: new sequelize.DataType.INTEGER,
            allowNull: true,
        },
        typeOfQuestion: {
            type: new sequelize.DataType.STRING(1024),
            allowNull: true,
        },
        questionDescriptions: {
            type: new sequelize.DataType.STRING(8192),
            allowNull: true,
        },
        formOptions: {
            type: new sequelize.DataType.STRING(8192),
            allowNull: true,
        },
        required: {
            type: new sequelize.DataType.STRING(8192),
            allowNull: true,
        },
        privacyOfQuestions: {
            type: new sequelize.DataType.STRING(8192),
            allowNull: true,
        },
        subscriptionDeadline: {
            type: new sequelize.DataType.DATE,
            allowNull: true,
        },
        published: {
            type: new sequelize.DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasCoverImage: {
            type: new sequelize.DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "activity",
        sequelize,
    }
)

// Relates activities to a group that organizes the activity.
Activity.Organizer = Activity.belongsTo(Group, {as: "Organizer", onDelete: 'CASCADE'});

Activity.sync();
Group.sync();
db.sync();

module.exports = Activity;

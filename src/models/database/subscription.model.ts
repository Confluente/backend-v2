import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Activity} from "./activity.model";
import {User} from "./user.model";

/**
 * subscription is the function relating users to activities via subscriptions.
 * Answers are the answers that the user gave to the questions of the form.
 */
// TODO add comments to this :)
@Table({timestamps: false})
export  class Subscription extends Model<Subscription> {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Activity)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    activityId: number;

    @Column(DataType.STRING(8192))
    answers: string;
}

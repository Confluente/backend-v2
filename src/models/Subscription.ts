import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Activity} from "./Activity";
import {User} from "./User";

/**
 * subscription is the function relating users to activities via subscriptions.
 * Answers are the answers that the user gave to the questions of the form.
 */
// TODO add comments to this :)
@Table({timestamps: false})
export  class Subscription extends Model<Subscription> {

    @Column(DataType.INTEGER.UNSIGNED)
    @ForeignKey(() => User)
    userId: number;

    @Column(DataType.INTEGER.UNSIGNED)
    @ForeignKey(() => Activity)
    activityId: number;

    @Column(DataType.STRING(8192))
    answers: string;
}

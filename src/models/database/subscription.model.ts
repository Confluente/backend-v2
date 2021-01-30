import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Activity} from "./activity.model";
import {User} from "./user.model";

/**
 * Table for storing the many-to-many relation between activities and users that have subscribed to an activity.
 */
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

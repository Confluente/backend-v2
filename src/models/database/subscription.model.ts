import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Activity} from "./activity.model";
import {User} from "./user.model";
import {stringValidationOrNull} from "../../helpers/type.validation.helper";

/**
 * Table for storing the many-to-many relation between activities and users that have subscribed to an activity.
 */
@Table({timestamps: false})
export  class Subscription extends Model {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Activity)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    activityId: number;

    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    answers: string;
}

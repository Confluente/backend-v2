import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Activity} from "./activity.model";
import {User} from "./user.model";
import {numberValidation, stringValidationOrNull} from "../../helpers/type.validation.helper";

/**
 * Table for storing the many-to-many relation between activities and users that have subscribed to an activity.
 */
@Table({timestamps: false})
export  class Subscription extends Model {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    userId: number;

    @ForeignKey(() => Activity)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    activityId: number;

    @Column({
        type: DataType.STRING(8192),
        validate: {stringValidationOrNull},
    })
    answers: string;
}

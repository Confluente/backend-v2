import {AllowNull, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import {Group} from "./group.model";
import {User} from "./user.model";
import {numberValidation, stringValidationOrNull} from "../../helpers/type.validation.helper";

/**
 * Table for storing the many-to-many relation between groups and their members.
 */
@Table({timestamps: false})
export class UserGroup extends Model {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    userId: number;

    @ForeignKey(() => Group)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    groupId: number;

    @AllowNull(false)
    @Default("member")
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    func: string;
}

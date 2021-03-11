import {AllowNull, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import {Group} from "./group.model";
import {User} from "./user.model";
import {stringValidationOrNull} from "../../helpers/type.validation.helper";

/**
 * Table for storing the many-to-many relation between groups and their members.
 */
@Table({timestamps: false})
export class UserGroup extends Model {

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Group)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    groupId: number;

    @AllowNull(false)
    @Default("member")
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidationOrNull},
    })
    func: string;
}

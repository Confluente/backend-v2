import {AllowNull, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import {Group} from "./Group";
import {User} from "./User";

/**
 * userGroup is the function relating users to groups via userGroup.
 * Function is the function that the user has in the group.
 */
// TODO add comments to this :)
@Table({timestamps: false})
export class UserGroup extends Model<UserGroup> {

    @Column(DataType.INTEGER.UNSIGNED)
    @ForeignKey(() => User)
    @AllowNull(false)
    userId: number;

    @Column(DataType.INTEGER.UNSIGNED)
    @ForeignKey(() => Group)
    @AllowNull(false)
    groupId: number;

    @Column(DataType.STRING(128))
    @AllowNull(false)
    @Default("member")
    func: string;
}

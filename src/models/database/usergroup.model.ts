import {AllowNull, Column, DataType, Default, ForeignKey, Model, Table} from "sequelize-typescript";
import {Group} from "./group.model";
import {User} from "./user.model";

/**
 * userGroup is the function relating users to groups via userGroup.
 * Function is the function that the user has in the group.
 */
// TODO add comments to this :)
@Table({timestamps: false})
export class UserGroup extends Model<UserGroup> {

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
    @Column(DataType.STRING(128))
    func: string;
}

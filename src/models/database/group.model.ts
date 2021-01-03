import {
    Table,
    Column,
    Model,
    DataType,
    AllowNull,
    PrimaryKey,
    Unique,
    BelongsToMany,
    ForeignKey, AutoIncrement
} from 'sequelize-typescript';
import {User} from "./user.model";
import {UserGroup} from "./usergroup.model";
import {Activity} from "./activity.model";

@Table({timestamps: false})
export class Group extends Model<Group> {

    @AllowNull(false)
    @AutoIncrement
    @Unique
    @ForeignKey(() => Activity)
    @Column(DataType.INTEGER)
    public id!: number;

    /**
     * Display name of the group (shorter than fullName but identifiable).
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public displayName!: string;

    /**
     * Full name of the group.
     */
    @PrimaryKey
    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(128))
    public fullName!: string;

    /**
     * Description of the group.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public description!: string;

    /**
     * Whether the group can organize activities.
     */
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    public canOrganize!: boolean;

    /**
     * The email address of the group.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public email!: string;

    /**
     * The type of the group.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public type!: string;

    // TODO add comment
    @BelongsToMany(() => User, () => UserGroup)
    public members: User[];
}
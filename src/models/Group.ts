import {Table, Column, Model, DataType, AllowNull, PrimaryKey, Unique, BelongsToMany} from 'sequelize-typescript';
import {User, UserGroup} from "./User";

@Table({timestamps: false})
export class Group extends Model {

    /**
     * Display name of the group (shorter than fullName but identifiable).
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public displayName!: string;

    /**
     * Full name of the group.
     */
    @Column(DataType.STRING(128))
    @PrimaryKey
    @AllowNull(false)
    @Unique
    public fullName!: string;

    /**
     * Description of the group.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public description!: string;

    /**
     * Whether the group can organize activities.
     */
    @Column(DataType.BOOLEAN)
    @AllowNull(false)
    public canOrganize!: boolean;

    /**
     * The email address of the group.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public email!: string;

    /**
     * The type of the group.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public type!: string;

    // TODO add comment
    @BelongsToMany(() => User, () => UserGroup)
    public members: User[];
}

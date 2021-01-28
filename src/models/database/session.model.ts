import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./user.model";

@Table({timestamps: false})
export class Session extends Model<Session> {

    /**
     * Token of the session.
     */
    @AllowNull(false)
    @Column(DataType.BLOB)
    public token!: any;

    /**
     * Id of the user of the session.
     */
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    public user!: number;

    /**
     * IP address of the user.
     */
    @AllowNull(false)
    @Column(DataType.STRING(128))
    public ip!: string;

    /**
     * Expiration date of the session.
     */
    @AllowNull(false)
    @Column(DataType.DATE)
    public expires!: any;
}

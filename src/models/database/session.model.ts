import {AllowNull, Column, DataType, Model, Table} from "sequelize-typescript";

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
    // TODO do we make this a foreign key?
    @AllowNull(false)
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

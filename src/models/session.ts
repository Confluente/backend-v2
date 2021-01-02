import {AllowNull, Column, DataType, Model, Table} from "sequelize-typescript";

@Table({timestamps: false})
export class Session extends Model {

    /**
     * Token of the session.
     */
    @Column(DataType.BLOB)
    @AllowNull(false)
    public token!: any;

    /**
     * Id of the user of the session.
     */
    // TODO check if this really should be a blob?? Robin is confused
    @Column(DataType.BLOB)
    @AllowNull(false)
    public user!: number;

    /**
     * IP address of the user.
     */
    @Column(DataType.STRING(128))
    @AllowNull(false)
    public ip!: string;

    /**
     * Expiration date of the session.
     */
    @Column(DataType.BLOB)
    @AllowNull(false)
    public expires!: any;
}

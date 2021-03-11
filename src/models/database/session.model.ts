import {AllowNull, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./user.model";
import {numberValidation, stringValidation} from "../../helpers/type.validation.helper";

@Table({timestamps: false})
export class Session extends Model {

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
    @Column({
        type: DataType.INTEGER,
        validate: {numberValidation}
    })
    public userId!: number;

    /**
     * IP address of the user.
     */
    @AllowNull(false)
    @Column({
        type: DataType.STRING(128),
        validate: {stringValidation},
    })
    public ip!: string;

    /**
     * Expiration date of the session.
     */
    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        validate: {isDate: true}
    })
    public expires!: any;
}

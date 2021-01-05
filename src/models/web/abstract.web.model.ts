import {Model} from "sequelize-typescript";

export abstract class AbstractWebModel {

    public static getArrayOfWebModelsFromArrayOfDbModels
            <A extends AbstractWebModel, B extends Model>(dbModels: B[]): A[] {
        const transformed: A[] = [];

        for (const obj of dbModels) {
            transformed.push(this.getWebModelFromDbModel(obj));
        }

        return transformed;
    }

    public static getWebModelFromDbModel<A extends AbstractWebModel, B extends Model>(dBModel: B): A {
        throw new Error("Not implemented for concrete class");
    }
}

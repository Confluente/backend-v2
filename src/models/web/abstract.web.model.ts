import {Model} from "sequelize-typescript";

export abstract class AbstractWebModel {

    public static getArrayOfWebModelsFromArrayOfDbModels<B extends Model>(dbModels: B[]): AbstractWebModel[] {
        const transformed: AbstractWebModel[] = [];

        for (const obj of dbModels) {
            transformed.push(this.getWebModelFromDbModel(obj));
        }

        return transformed;
    }

    public static getWebModelFromDbModel<B extends Model>(dBModel: B): AbstractWebModel {
        throw new Error("Not implemented for concrete class");
    }

    public getCopyable(): string[] {
        throw new Error("Not implemented for concrete class");
    }
}

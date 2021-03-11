import {Model} from "sequelize-typescript";

export abstract class AbstractWebModel {

    public static async getArrayOfWebModelsFromArrayOfDbModels<B extends Model>(dbModels: B[]):
        Promise<AbstractWebModel[]> {
        const transformed: AbstractWebModel[] = [];

        for (const obj of dbModels) {
            await this.getWebModelFromDbModel(obj).then(function(awm: AbstractWebModel): void {
                transformed.push(awm);
            });
        }

        return transformed;
    }

    public static async getWebModelFromDbModel<B extends Model>(dBModel: B): Promise<AbstractWebModel> {
        throw new Error("Not implemented for concrete class");
    }

    public getCopyable(): string[] {
        throw new Error("Not implemented for concrete class");
    }
}

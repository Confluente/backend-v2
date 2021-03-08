import {ValidationError} from "sequelize";

export const stringValidation = (data: any) => {
    if (typeof data !== "string") {
        throw new ValidationError("Table column expected string but received " + (typeof data).toString());
    }
};

export const booleanValidation = (data: any) => {
    if (typeof data !== "boolean") {
        throw new ValidationError("Table column expected boolean but received " + (typeof data).toString());
    }
};


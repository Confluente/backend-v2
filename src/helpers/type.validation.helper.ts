import {ValidationError} from "sequelize";

export const stringValidation = (data: any) => {
    if (typeof data !== "string") {
        throw new ValidationError("Table column expected string but received " + (typeof data).toString());
    }
};

export const stringValidationOrNull = (data: any) => {
    if (typeof data !== "string" && data !== null) {
        throw new ValidationError("Table column expected string (or null) but received " + (typeof data).toString());
    }
};

export const booleanValidation = (data: any) => {
    if (typeof data !== "boolean") {
        throw new ValidationError("Table column expected boolean but received " + (typeof data).toString());
    }
};

export const booleanValidationOrNull = (data: any) => {
    if (typeof data !== "boolean" && data !== null) {
        throw new ValidationError("Table column expected boolean(or null) but received " + (typeof data).toString());
    }
};

export const numberValidation = (data: any) => {
    if (typeof data !== "number") {
        throw new ValidationError("Table column expected number but received " + (typeof data).toString());
    }
};

export const numberValidationOrNull = (data: any) => {
    if (typeof data !== "number" && data !== null) {
        throw new ValidationError("Table column expected number (or null) but received " + (typeof data).toString());
    }
};

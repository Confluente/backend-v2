import {Sequelize} from 'sequelize';

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";

export const db = new Sequelize("sequel", null, null, {dialect: "sqlite", logging: null, storage});


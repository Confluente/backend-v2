import {Sequelize} from 'sequelize';

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";

export let db: Sequelize = new Sequelize("sequel", null, null, {dialect: "sqlite", logging: null, storage});


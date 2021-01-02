import {Sequelize} from 'sequelize-typescript';

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";

export const db: Sequelize = new Sequelize({
    database: "db",
    dialect: "sqlite",
    username: null,
    password: null,
    storage,
    models: [__dirname + '/models']
});


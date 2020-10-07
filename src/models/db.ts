const sequelize = require("sequelize");
const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";

const db = new sequelize("sequel", null, null, {dialect: "sqlite", logging: null, storage: storage});

module.exports = db;

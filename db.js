const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "user",
  password: "1234",
  database: "shop",
  schema: "public",
});

module.exports = sequelize;

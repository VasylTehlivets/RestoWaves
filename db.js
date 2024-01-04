const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseName = "shop";
const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: DB_USERNAME,
  password: DB_PASSWORD,
  logging: false,
});

// Створення бази даних "shop", якщо вона ще не існує
sequelize
  .query(`CREATE DATABASE ${databaseName}`)
  .then(() => {
    console.log("Database created or already exists");
    sequelize.close();
  })
  .catch((error) => {
    console.error("Unable to create the database:", error);
    sequelize.close();
  });

module.exports = sequelize;

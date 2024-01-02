const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Синхронізація бази даних
sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

// Оголошуємо модель продукту
const Product = sequelize.define("Product", {
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  article: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sizes: {
    type: DataTypes.JSON, // Може бути JSON або ARRAY, залежно від потреб.
    allowNull: true,
  },
});

module.exports = Product;

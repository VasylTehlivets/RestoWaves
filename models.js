const { DataTypes } = require("sequelize");
const sequelize = require("./db");

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

// Викликаємо sync(), щоб створити таблицю у базі даних

Product.sync()
  .then(() => {
    console.log("Product table created");
  })
  .catch((error) => {
    console.error("Unable to create Product table:", error);
  })
  .finally(() => {
    sequelize.close();
  });

// Модель категорії
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель підкатегорії
const Subcategory = sequelize.define("Subcategory", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель бренду
const Brand = sequelize.define("Brand", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель моделі
const Model = sequelize.define("Model", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Встановлення зв'язків між таблицями
Category.hasMany(Subcategory);
Subcategory.belongsTo(Category);

Subcategory.hasMany(Brand);
Brand.belongsTo(Subcategory);

Brand.hasMany(Model);
Model.belongsTo(Brand);

module.exports = Product;
module.exports = { Category, Subcategory, Brand, Model };

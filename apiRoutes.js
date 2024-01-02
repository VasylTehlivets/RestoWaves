const express = require("express");
const { Op } = require("sequelize");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { Product } = require("./models");

const router = express.Router();

// Отримати дані з Google таблиці та зберегти в базі даних
router.get("/sync-products", async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(
      "https://docs.google.com/spreadsheets/d/1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU/edit#gid=0"
    );
    await doc.useServiceAccountAuth({
      client_email: "YOUR_CLIENT_EMAIL",
      private_key: "YOUR_PRIVATE_KEY",
    });
    await doc.loadInfo(); // Завантажити таблицю

    const sheet = doc.sheetsByIndex[0]; // Використовуємо перший лист

    const rows = await sheet.getRows(); // Отримати всі рядки з листа

    // Обробка отриманих даних та збереження/оновлення продуктів у базі даних
    for (const row of rows) {
      const existingProduct = await Product.findOne({
        where: { article: row.article },
      });

      if (existingProduct) {
        // Оновити існуючий продукт
        existingProduct.name = row.name;
        existingProduct.price = row.price;
        existingProduct.sizes = JSON.parse(row.sizes); // Перетворення рядка JSON у об'єкт
        await existingProduct.save();
      } else {
        // Створити новий продукт
        await Product.create({
          model: row.model,
          article: row.article,
          name: row.name,
          price: row.price,
          sizes: JSON.parse(row.sizes), // Перетворення рядка JSON у об'єкт
        });
      }
    }

    res.status(200).send("Data synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Отримати усі товари
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Отримати 1 товар по айді
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(`Error fetching product with id ${productId}:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Змінити ім'я товару
router.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const newName = req.body.newName;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      product.name = newName;
      await product.save();
      res.json(product);
    }
  } catch (error) {
    console.error(`Error updating product with id ${productId}:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Показати товар тільки по вибраному розміру
router.get("/products/size/:size", async (req, res) => {
  const size = req.params.size;

  try {
    const products = await Product.findAll({
      where: {
        sizes: {
          [size]: {
            [Op.ne]: null,
          },
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products with size ${size}:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Додати новий товар
router.post("/products", async (req, res) => {
  const { model, article, name, price, sizes } = req.body;

  try {
    const newProduct = await Product.create({
      model,
      article,
      name,
      price,
      sizes,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating a new product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Оновити розміри товару
router.put("/products/update-sizes/:id", async (req, res) => {
  const productId = req.params.id;
  const newSizes = req.body.newSizes;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      product.sizes = newSizes;
      await product.save();
      res.json(product);
    }
  } catch (error) {
    console.error(
      `Error updating sizes for product with id ${productId}:`,
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

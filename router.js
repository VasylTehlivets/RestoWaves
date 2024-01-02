const express = require("express");
const { Op } = require("sequelize");
const { Product } = require("./models");
const { updateDatabase } = require("./services");
const { handleErrors, createProduct, updateProduct } = require("./helpers");

const router = express.Router();

// Отримати дані з Google таблиці та зберегти в базі даних
router.get("/sync-products", async (req, res) => {
  try {
    await updateDatabase(res);
    res.status(200).send("Data synchronized successfully");
  } catch (error) {
    handleErrors(res, "synchronizing data", error);
  }
});

// Отримати усі товари
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    handleErrors(res, "fetching products", error);
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
    handleErrors(res, `fetching product with id ${productId}`, error);
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
      await updateProduct(res, product, { name: newName });
    }
  } catch (error) {
    handleErrors(res, `updating product with id ${productId}`, error);
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
    handleErrors(res, `fetching products with size ${size}`, error);
  }
});

// Додати новий товар
router.post("/products", async (req, res) => {
  const { model, article, name, price, sizes } = req.body;

  await createProduct(res, { model, article, name, price, sizes });
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
      await updateProduct(res, product, { sizes: newSizes });
    }
  } catch (error) {
    handleErrors(res, `updating sizes for product with id ${productId}`, error);
  }
});

module.exports = router;

// Функція для обробки помилок та відправки відповіді з кодом статусу та повідомленням помилки
const handleErrors = (res, action, error) => {
  console.error(`Error ${action}:`, error);
  res.status(500).send("Internal Server Error");
};

// Функція для створення нового продукту та обробки помилок
const createProduct = async (res, productData) => {
  try {
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    handleErrors(res, "creating a new product", error);
  }
};

// Функція для оновлення продукту та обробки помилок
const updateProduct = async (res, product, updateData) => {
  try {
    Object.assign(product, updateData);
    await product.save();
    res.json(product);
  } catch (error) {
    handleErrors(res, `updating product with id ${product.id}`, error);
  }
};

module.exports = { handleErrors, createProduct, updateProduct };

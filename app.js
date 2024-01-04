const express = require("express");
const { fetchDataFromGoogleSheet, updateDatabase } = require("./services.js");
const router = require("./router");

const app = express();
const port = 3000;

app.use(express.json()); // Додаємо middleware для обробки JSON у запитах

app.use("/", router);

app.get("/fetch-data", async (req, res) => {
  try {
    const data = await fetchDataFromGoogleSheet();
    res.json(data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

// Регулярний запит для оновлення розмірів та додавання нових товарів до бази даних (кожну годину)
setInterval(updateDatabase, 3600000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

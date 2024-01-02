const express = require("express");
const sequelize = require("./db.js");
const Product = require("./models.js");
const apiRoutes = require("./apiRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Додамо middleware для парсингу JSON
app.use(express.json());

// Підключимо API роутер
app.use("/api", apiRoutes);

// app.get("/", (reg, res) => {
//   res.send("Hello, word");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connected to the database");
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//   });

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
    // Додамо код для обробки помилок на рівні сервера
    res.status(500).send("Internal Server Error");
  });

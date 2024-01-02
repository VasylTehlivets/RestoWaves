// const express = require("express");
// const sequelize = require("./db.js");
// const Product = require("./models.js");
// const apiRoutes = require("./apiRoutes.js");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Додамо middleware для парсингу JSON
// app.use(express.json());

// // Підключимо API роутер
// app.use("/api", apiRoutes);

////////////////////////////////////////////////////////////////////////////
// // app.get("/", (reg, res) => {
// //   res.send("Hello, word");
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

// // sequelize
// //   .authenticate()
// //   .then(() => {
// //     console.log("Connected to the database");
// //   })
// //   .catch((error) => {
// //     console.error("Unable to connect to the database:", error);
// //   });
// ///////////////////////////////////////////////////////////////////////////
// sequelize
//   .sync()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//     // Додамо код для обробки помилок на рівні сервера
//     res.status(500).send("Internal Server Error");
//   });

//////////////////////////////////////////////////////////////////////
// const express = require("express");
// const axios = require("axios");

// const app = express();
// const port = 3000;

// app.get("/fetch-data", async (req, res) => {
//   try {
//     const response = await axios.get(
//       // "https://docs.google.com/spreadsheets/d/1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU/edit#gid=0"
//       "https://spreadsheets.google.com/feeds/list/1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU/od6/public/values?alt=json"
//     );
//     const data = response.data; // Отримані дані з таблиці
//     // Тут ви можете обробити та використати отримані дані
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
////////////////////////////////////////////////////////////////////////////////////////////
const express = require("express");
// const { fetchDataFromGoogleSheet } = require("./googleTable.js");
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
// // Регулярний запит для оновлення розмірів (кожну годину)
// setInterval(async () => {
//   try {
//     // Ваш код для оновлення розмірів
//     console.log("Updating sizes...");
//   } catch (error) {
//     console.error("Error updating sizes:", error);
//   }
// }, 3600000); // 1 година

// Регулярний запит для оновлення розмірів та додавання нових товарів до бази даних (кожну годину)
setInterval(updateDatabase, 3600000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

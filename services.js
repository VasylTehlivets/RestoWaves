const axios = require("axios");
const Product = require("./models");
const { logger } = require("./logger");

// Запит для отримання даних з Google таблиці
async function fetchDataFromGoogleSheet() {
  try {
    const response = await axios.get(
      "https://spreadsheets.google.com/feeds/list/1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU/od6/public/values?alt=json"
    );

    return response.data.feed.entry.map((entry) => {
      return {
        model: entry.gsx$model.$t,
        article: entry.gsx$article.$t,
        name: entry.gsx$name.$t,
        price: parseFloat(entry.gsx$price.$t),
        sizes: entry.gsx$sizes.$t.split(",").map((size) => size.trim()),
      };
    });
  } catch (error) {
    logger.error("Error fetching data from Google Sheet:", error);
    throw error;
  }
}

async function updateDatabase() {
  try {
    const googleSheetData = await fetchDataFromGoogleSheet();

    for (const item of googleSheetData) {
      await Product.upsert(item, { where: { article: item.article } });
    }

    logger.info("Database updated successfully!");
  } catch (error) {
    logger.error("Error updating database:", error);
  }
}

module.exports = { fetchDataFromGoogleSheet, updateDatabase };

const axios = require("axios");

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
    console.error("Error fetching data from Google Sheet:", error);
    throw error;
  }
}

module.exports = { fetchDataFromGoogleSheet };

const dbConnection = require("./config/db");
const express = require("express");
require("dotenv").config({path: "./config.env"});

const app = express();

dbConnection();

app.get("/", (req, res) => {
  res.send("Hello node JS");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

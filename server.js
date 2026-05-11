const dbConnection = require("./config/db");
const express = require("express");
const path = require('path');
require("dotenv").config({path: "./config.env"});

const userRouter = require('./routes/userRoutes');
const prescriptionRouter = require('./routes/prescriptionRoutes');

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json());

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbConnection();

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/prescriptions', prescriptionRouter);

app.get("/", (req, res) => {
  res.send("Hello node JS");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

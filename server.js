const dbConnection = require("./config/db");
const express = require("express");
const path = require('path');
require("dotenv").config({path: "./config.env"});

const userRouter = require('./routes/userRoutes');
const prescriptionRouter = require('./routes/prescriptionRoutes');
const pharmacyRouter = require('./routes/contractedPharmacyRoutes');
const globalError = require('./middlewares/globalError');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbConnection();

app.use('/api/v1/users', userRouter);
app.use('/api/v1/prescriptions', prescriptionRouter);
app.use('/api/v1/pharmacies', pharmacyRouter);
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/location', require('./routes/locationRoutes'));

app.use((req, res, next) => {
  next(new AppError(`لا يمكن العثور على هذا المسار ${req.originalUrl} على هذا الخادم!`, 404));
});

app.use(globalError);

app.get("/", (req, res) => {
  res.send("Hello node JS");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

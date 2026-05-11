const express = require('express');
const locationController = require('../controllers/locationController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/nearby-pharmacies', authController.protect, locationController.getNearbyPharmacies);

module.exports = router;

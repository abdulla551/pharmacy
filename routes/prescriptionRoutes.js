const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post(
  '/',
  prescriptionController.uploadPrescriptionImage,
  prescriptionController.createPrescription
);

module.exports = router;

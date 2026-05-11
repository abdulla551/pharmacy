const express = require('express');
const pharmacyController = require('../controllers/contractedPharmacyController');
const authController = require('../controllers/authController');
const { createPharmacyValidator } = require('../utils/validators/pharmacyValidator');

const router = express.Router();
router.post('/login', authController.pharmacyLogin);

router.get('/', pharmacyController.getAllPharmacies);


router.use(authController.protect);

router.post(
  '/',
  authController.restrictTo('admin', 'super-admin'),
  createPharmacyValidator,
  pharmacyController.createPharmacy
);

module.exports = router;

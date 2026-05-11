const express = require('express');
const authController = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/superadmin-login', loginValidator, authController.superAdminLogin);


router.post(
  '/create-admin',
  authController.protect,
  authController.restrictTo('super-admin'),
  authController.createAdmin
);

module.exports = router;
const { check } = require('express-validator');
const validatorMiddleware = require('../../utils/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('اسم المستخدم مطلوب')
    .isLength({ min: 3 })
    .withMessage('اسم المستخدم قصير جداً'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('البريد الإلكتروني موجود بالفعل'));
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  check('phone')
    .notEmpty()
    .withMessage('رقم الهاتف مطلوب')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('رقم الهاتف غير صحيح (يجب أن يكون 11 رقم ويبدأ بـ 01)')
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('رقم الهاتف موجود بالفعل'));
        }
      })
    ),
  validatorMiddleware,
];

exports.loginValidator = [
  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
  validatorMiddleware,
];

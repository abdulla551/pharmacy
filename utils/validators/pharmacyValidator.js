const { check } = require('express-validator');
const validatorMiddleware = require('../../utils/validatorMiddleware');

exports.createPharmacyValidator = [
  check('name')
    .notEmpty()
    .withMessage('اسم الصيدلية مطلوب')
    .isLength({ min: 3 })
    .withMessage('اسم الصيدلية قصير جداً'),
  check('address')
    .notEmpty()
    .withMessage('عنوان الصيدلية مطلوب'),
  check('phone')
    .notEmpty()
    .withMessage('رقم هاتف الصيدلية مطلوب')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('رقم الهاتف غير صحيح (يجب أن يكون 11 رقم ويبدأ بـ 01)'),
  check('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  validatorMiddleware,
];

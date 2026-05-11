const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ContractedPharmacy = require('../models/contractedPharmacyModel');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return next(new AppError('من فضلك أدخل البريد الإلكتروني/رقم الهاتف وكلمة المرور', 400));
    }
    const user = await User.findOne({ 
      $or: [{ email: email || '___' }, { phone: phone || '___' }] 
    }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('البيانات غير صحيحة', 401));
    }
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('أنت غير مسجل، من فضلك سجل الدخول للوصول لهذه الصفحة', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      currentUser = await ContractedPharmacy.findById(decoded.id);
    }
    if (!currentUser) {
      return next(new AppError('المستخدم أو الصيدلية صاحب هذا التوكن لم يعد موجوداً', 401));
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للقيام بهذا الإجراء', 403));
    }
    next();
  };
};

exports.createAdmin = async (req, res, next) => {
  try {
    const newAdmin = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
      role: 'admin'
    });
    res.status(201).json({
      status: 'success',
      data: {
        user: newAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.superAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('من فضلك أدخل البريد الإلكتروني وكلمة المرور', 400));
    }
    const user = await User.findOne({ email, role: 'super-admin' }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('البيانات غير صحيحة، أو أنك لست Super Admin', 401));
    }
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.pharmacyLogin = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return next(new AppError('من فضلك أدخل رقم الهاتف وكلمة المرور الخاصة بالصيدلية', 400));
    }
    const pharmacy = await ContractedPharmacy.findOne({ phone }).select('+password');
    if (!pharmacy || !(await pharmacy.correctPassword(password, pharmacy.password))) {
      return next(new AppError('بيانات الدخول غير صحيحة', 401));
    }
    createSendToken(pharmacy, 200, res);
  } catch (err) {
    next(err);
  }
};

const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `بيانات غير صالحة لـ ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {

  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  let translatedField = field;
  if (field === 'email') translatedField = 'البريد الإلكتروني';
  if (field === 'phone') translatedField = 'رقم الهاتف';
  if (field === 'name') translatedField = 'الاسم';

  const message = `قيمة ${translatedField} (${value}) موجودة بالفعل. من فضلك استخدم قيمة أخرى!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `بيانات غير صالحة: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('التوكن غير صالح. من فضلك سجل الدخول مرة أخرى!', 401);

const handleJWTExpiredError = () =>
  new AppError('انتهت صلاحية الجلسة! من فضلك سجل الدخول مرة أخرى.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR ', err);
    res.status(500).json({
      status: 'error',
      message: 'حدث خطأ ما في الخادم!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

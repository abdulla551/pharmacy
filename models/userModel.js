const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [50, 'اسم المستخدم يجب ألا يزيد عن 50 حرف']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'من فضلك أدخل بريد إلكتروني صالح'],
    sparse: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'super-admin'],
      message: 'الصلاحية غير صالحة'
    },
    default: 'user'
  },
  location: {
    lat: Number,
    lng: Number
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

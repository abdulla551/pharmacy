const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_URI;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const createSuperAdmin = async () => {
  try {
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@pharmacy.com',
      password: 'superpassword123',
      role: 'super-admin'
    });
    console.log('Super Admin created successfully!');
  } catch (err) {
    console.error('Error creating Super Admin:', err.message);
  } finally {
    process.exit();
  }
};

createSuperAdmin();

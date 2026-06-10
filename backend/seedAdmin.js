const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/database');

const seed = async () => {
  try {
    await connectDB();

    const username = 'techstore_admin';
    const password = 'techstore_admin123';

    const exists = await Admin.findOne({ username });
    if (exists) {
      console.log('Admin ya existe.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username, password: hashed });
    console.log('Admin creado:', admin.username);
    process.exit(0);
  } catch (error) {
    console.error('Error al crear admin:', error.message);
    process.exit(1);
  }
};

seed();


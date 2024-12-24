const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const dbURL = process.env.DATABASE_URL;

    if (!dbURL) {
      throw new Error('DATABASE_URL is not defined in the .env file');
    }
    await mongoose.connect(dbURL);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
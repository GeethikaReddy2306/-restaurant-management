const mongoose = require('mongoose');
const dns=require('dns');
require('dotenv').config();
dns.setServers(['1.1.1.1','8.8.8.8']);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

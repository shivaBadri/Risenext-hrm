const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/riseNextHRM";
  await mongoose.connect(uri);
  console.log("MongoDB Connected");
};

module.exports = connectDB;

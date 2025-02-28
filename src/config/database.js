const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aayushpandey1100:CfklSYdZ2O9Y0toV@developerstinder.zeatc.mongodb.net/"
  );
};

module.exports = connectDB;

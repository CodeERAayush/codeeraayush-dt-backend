const mongoose = require("mongoose");
require('dotenv').config()
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: [String],
      default: ["https://geographyandyou.com/images/user-profile.png"]
    },
    lookingFor: {
      type: [String],
      enum: {
        values: ["Fellow Developers", "Fresher Devs", "Experienced Devs", "Partners"],
        message: `{VALUE} is not a valid option`,
      },
    },
    communicationStyle: {
      type: String,
      enum: {
        values: ["On Whatsapp All Day", "Video Chatter", "Voice Caller", "Emails"],
        message: `{VALUE} is not a valid option`,
      },
    },
    educationLevel: {
      type: String,
      enum: {
        values: ["Bachelors", "College", "HighSchool", "PhD", "In Grad School", "Masters"],
        message: `{VALUE} is not a valid option`,
      },
    },
    about: {
      type: String,
      default: "Hey👋 I am using DevTinder!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);

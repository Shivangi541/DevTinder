const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain the word 'password'");
        }
        if (validator.isEmpty(value)) {
          throw new Error("Password cannot be empty");
        }
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not correct");
        }
      },
    },
    skills: {
      type: [String],
      default: undefined,
      validate(value) {
        if (value && value.length > 10) {
          throw new Error("Skills array exceeds maximum length of 10");
        }
      },
    },
    about: {
      type: String,
      default: "No information provided",
    },
  },
  { timestamps: true }
);
userSchema.methods.getJWt = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "your_jwt_secret_key");
  console.log("JWT token generated successfully:", token);
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

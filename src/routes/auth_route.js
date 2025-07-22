const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateUserInput } = require("../utils/validation");

const User = require("@models/user");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // validation
    const validationError = validateUserInput(req);
    if (validationError) {
      return res.status(400).send(validationError);
    }

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully" + passwordHash);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User created successfully");
    console.log("User created successfully:", user);
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    } else {
      // jwt auhorization
      const token = user.getJWt();
      // cookie validation
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      res.send("Login successful");
      console.log("User logged in successfully:", user);
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
});
// Export the authRouter
module.exports = authRouter;

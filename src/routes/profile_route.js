const express = require("express");
const User = require("@models/user");
const profileRouter = express.Router();
const auth = require("@middlewares/auth");

profileRouter.get("/profile/view", auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User not found in request");
    }
    res.send(user);
    console.log("Profile fetched successfully:", user);
  } catch (error) {
    res.status(400).send("Error reading cookie: " + error.message);
  }
});

module.exports = profileRouter;

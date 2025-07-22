const express = require("express");
const User = require("@models/user");
const profileRouter = express.Router();
const auth = require("@middlewares/auth");
const bcrypt = require("bcrypt");
const { validateEditinfo } = require("@utils/validation");
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
profileRouter.patch("/profile/edit", auth, async (req, res) => {
  try {
    if (!validateEditinfo(req)) {
      throw new Error("Invalid fields for edit. Allowed fields are");
    }

    const loggedInUser = req.user;
    console.log("Logged in user:", loggedInUser);
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });
    await loggedInUser.save();
    console.log("Profile updated successfully:", loggedInUser);
    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
});
// edit password api
// everything happens after auth
profileRouter.patch("/profile/edit/password", auth, async (req, res) => {
  try {
    // update password only for logged in user
    const loggedInUser = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new Error("Current and new passwords are required.");
    }
    const isMatch = await loggedInUser.validatePassword(currentPassword);

    // encrypt new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();
    res.send("Password updated successfully");
    console.log("Password updated successfully for user:", loggedInUser.email);
  } catch (error) {
    res.status(400).send("Error updating password: " + error.message);
  }
});
module.exports = profileRouter;

const express = require("express");
const requestRouter = express.Router();
const auth = require("@middlewares/auth");

requestRouter.post("/sendConnectionRequest", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Connection request sent successfully");
    console.log(user.firstName + " sent the connection request successfully");
  } catch (error) {
    res.status(400).send("Error sending connection request: " + error.message);
  }
});

module.exports = requestRouter;

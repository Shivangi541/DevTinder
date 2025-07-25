const express = require("express");
const userRouter = express.Router();
const auth = require("@middlewares/auth");
const ConnectionRequest = require("@models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName";
// get all connections of the logged in user
userRouter.get("/user/connections/pending", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("Logged In User:", loggedInUser);
    const connections = ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!connections) {
      return res.status(404).json({ message: "No connections found." });
    }
    console.log("Connections:", connections);
    res.status(200).json({
      message: "Connections fetched successfully",
      data: connections,
    });
  } catch (error) {
    res.status(400).send("Error fetching connections: " + error.message);
  }
});
userRouter.get("/user/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ data: connectionRequests });
  } catch (error) {
    res.status(400).send("Error fetching connections" + error.message);
  }
});
module.exports = userRouter;

const express = require("express");
const requestRouter = express.Router();
const auth = require("@middlewares/auth");
const ConnectionRequest = require("@models/connectionRequest");
requestRouter.post(
  "/request/sent/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const normalizedStatus = status.toLowerCase();
      if (!toUserId) {
        throw new Error("To user ID is required.");
      }
      if (fromUserId.toString() === toUserId) {
        throw new Error("You cannot send a request to yourself.");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("To user does not exist.");
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(normalizedStatus)) {
        throw new Error(
          "Invalid status. Allowed values are 'interested' or 'ignored'."
        );
      }
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        throw new Error("Connection request already exists.");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();
      res.status(201).json({
        message: "Connection request sent successfully",
        data,
      });
      console.log("Connection request sent successfully:", data);
    } catch (error) {
      res
        .status(400)
        .send("Error sending connection request: " + error.message);
    }
  }
);
module.exports = requestRouter;

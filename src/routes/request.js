const express = require("express");
const requestRouter = express.Router();
const auth = require("@middlewares/auth");

const User = require("@models/user");
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
requestRouter.post(
  "/request/review/:status/:requestId",
  auth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      console.log("Logged In User:", req.user);
      console.log("Request ID:", requestId);
      // Normalize and validate status
      const normalizedStatus = status.toLowerCase();
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(normalizedStatus)) {
        return res.status(400).json({
          message: "Invalid status. Allowed values: accepted or rejected.",
        });
      }

      // Find the connection request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found or already reviewed.",
        });
      }

      // Update status and save
      connectionRequest.status = normalizedStatus;
      const updatedRequest = await connectionRequest.save();

      // Success response
      return res.status(200).json({
        message: `Connection request ${normalizedStatus} successfully.`,
        data: updatedRequest,
      });
    } catch (error) {
      console.error("Error reviewing request:", error);
      return res.status(500).json({
        message: "Internal server error while reviewing connection request.",
      });
    }
  }
);

module.exports = requestRouter;

const express = require("express");
const userRouter = express.Router();
const auth = require("@middlewares/auth");
const USER_SAFE_DATA = "firstName lastName";
const User = require("@models/user");
const ConnectionRequest = require("@models/connectionRequest");
userRouter.get("/users/connections/pending", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) throw new Error(" login please");
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: " data fetched successfully",
      data: connectionRequest,
    });
  } catch (error) {
    req.statusCode(400).send("unsuccessul" + error.message);
  }
});
userRouter.get("/users/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) throw new Error("please login");
    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionreq);
    const connectionreq = connections.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      connectionreq,
    });
  } catch (error) {
    res.send("unsuccessful" + error.message);
  }
});
userRouter.get("/users/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // adding pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const connectionreq = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId", "toUserId");

    const hidefromFeed = new Set();
    connectionreq.forEach((req) => {
      hidefromFeed.add(req.fromUserId.toString());
      hidefromFeed.add(req.toUserId.toString());
    });
    console.log(hidefromFeed);
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hidefromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName", "lastName", "skills", "about", "gender");

    res.send(user);
  } catch (error) {
    res.send("there is some error!!" + error.message);
  }
});
module.exports = userRouter;

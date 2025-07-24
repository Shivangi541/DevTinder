const mongoose = require("mongoose");
const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "accepted", "rejected", "ignored"],
        message:
          "Status must be one of 'interested', 'accepted', 'rejected', or 'ignored'",
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionSchema.index({ fromUserId: 1, toUserId: 1 });
connectionSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself.");
  }
  next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
module.exports = ConnectionRequest;

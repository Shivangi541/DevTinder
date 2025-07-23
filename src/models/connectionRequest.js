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

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);
module.exports = ConnectionRequest;

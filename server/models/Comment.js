const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: String,
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ rideId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);

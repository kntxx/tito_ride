const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["new_ride", "ride_update", "join_ride", "comment"],
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    triggeredBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      profileImage: {
        type: String,
        default: "https://ui-avatars.com/api/?name=User&background=random",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }); // For cleanup queries

// Cleanup notifications older than 60 days
notificationSchema.statics.cleanupOldNotifications = async function () {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return this.deleteMany({
    createdAt: { $lt: sixtyDaysAgo },
  });
};

module.exports = mongoose.model("Notification", notificationSchema);

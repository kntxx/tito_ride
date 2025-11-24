const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ride title is required"],
      trim: true,
    },
    meetupTime: {
      type: Date,
      required: [true, "Meetup time is required"],
    },
    meetupLocation: {
      type: String,
      required: [true, "Meetup location is required"],
      trim: true,
    },
    rideType: {
      type: String,
      enum: ["Chill", "Race Pace"],
      required: [true, "Ride type is required"],
    },
    routeLocation: {
      type: String,
      trim: true,
    },
    gpxLink: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    maxRiders: {
      type: Number,
      min: 1,
    },
    creator: {
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
    },
    participants: [
      {
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
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for participant count
rideSchema.virtual("participantCount").get(function () {
  return this.participants ? this.participants.length : 0;
});

// Ensure virtuals are included when converting to JSON
rideSchema.set("toJSON", { virtuals: true });
rideSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Ride", rideSchema);

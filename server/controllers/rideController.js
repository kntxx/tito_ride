const Ride = require("../models/Ride");
const User = require("../models/User");
const {
  createAndEmitNotification,
  createBulkNotifications,
} = require("../utils/notificationHelper");

// @desc    Create new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res) => {
  try {
    const {
      title,
      meetupTime,
      meetupLocation,
      rideType,
      routeLocation,
      gpxLink,
      description,
      maxRiders,
    } = req.body;

    const ride = await Ride.create({
      title,
      meetupTime,
      meetupLocation,
      rideType,
      routeLocation,
      gpxLink,
      description,
      maxRiders,
      creator: {
        userId: req.user._id,
        name: req.user.name,
        profileImage: req.user.profileImage,
      },
    });

    // Get all users except the creator to notify them of new ride
    const io = req.app.get("io");
    if (io) {
      try {
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select(
          "_id"
        );
        const userIds = allUsers.map((user) => user._id);

        if (userIds.length > 0) {
          await createBulkNotifications(io, userIds, {
            type: "new_ride",
            rideId: ride._id,
            message: `🚵 New ride posted: ${ride.title}`,
            triggeredBy: {
              userId: req.user._id,
              name: req.user.name,
              profileImage: req.user.profileImage,
            },
          });
        }
      } catch (error) {
        console.error("Error creating new ride notifications:", error);
      }
    }

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Public
const getRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ meetupTime: 1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ride by ID
// @route   GET /api/rides/:id
// @access  Public
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (ride) {
      res.json(ride);
    } else {
      res.status(404).json({ message: "Ride not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a ride
// @route   POST /api/rides/:id/join
// @access  Private
const joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user already joined
    const alreadyJoined = ride.participants.some(
      (participant) => participant.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this ride" });
    }

    // Check if ride is full
    if (ride.maxRiders && ride.participants.length >= ride.maxRiders) {
      return res.status(400).json({ message: "Ride is full" });
    }

    // Add user to participants
    ride.participants.push({
      userId: req.user._id,
      name: req.user.name,
      profileImage: req.user.profileImage,
    });

    await ride.save();

    // Notify ride creator when someone joins
    const io = req.app.get("io");
    if (io && ride.creator.userId.toString() !== req.user._id.toString()) {
      try {
        await createAndEmitNotification(io, {
          userId: ride.creator.userId,
          type: "join_ride",
          rideId: ride._id,
          message: `👤 ${req.user.name} joined your ride: ${ride.title}`,
          triggeredBy: {
            userId: req.user._id,
            name: req.user.name,
            profileImage: req.user.profileImage,
          },
        });
      } catch (error) {
        console.error("Error creating join notification:", error);
      }
    }

    res.json({
      message: "Successfully joined ride",
      participantCount: ride.participantCount,
      participants: ride.participants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unjoin a ride
// @route   POST /api/rides/:id/unjoin
// @access  Private
const unjoinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is in participants
    const participantIndex = ride.participants.findIndex(
      (participant) => participant.userId.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: "Not joined this ride" });
    }

    // Remove user from participants
    ride.participants.splice(participantIndex, 1);

    await ride.save();

    res.json({
      message: "Successfully left ride",
      participantCount: ride.participantCount,
      participants: ride.participants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a ride
// @route   PUT /api/rides/:id
// @access  Private
const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is the creator
    if (ride.creator.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this ride" });
    }

    // Check if location or time changed
    const locationChanged =
      req.body.meetupLocation &&
      req.body.meetupLocation !== ride.meetupLocation;
    const timeChanged =
      req.body.meetupTime && req.body.meetupTime !== ride.meetupTime;

    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify all participants of ride update
    const io = req.app.get("io");
    if (
      io &&
      (locationChanged || timeChanged) &&
      ride.participants.length > 0
    ) {
      try {
        const participantIds = ride.participants.map((p) => p.userId);
        let message = `📍 Ride "${ride.title}" has been updated`;

        if (locationChanged && timeChanged) {
          message = `📍 Ride "${ride.title}" changed time and location`;
        } else if (locationChanged) {
          message = `📍 Ride "${ride.title}" changed location`;
        } else if (timeChanged) {
          message = `🕐 Ride "${ride.title}" changed time`;
        }

        await createBulkNotifications(io, participantIds, {
          type: "ride_update",
          rideId: ride._id,
          message,
          triggeredBy: {
            userId: req.user._id,
            name: req.user.name,
            profileImage: req.user.profileImage,
          },
        });
      } catch (error) {
        console.error("Error creating update notifications:", error);
      }
    }

    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a ride
// @route   DELETE /api/rides/:id
// @access  Private
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is the creator
    if (ride.creator.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this ride" });
    }

    await Ride.findByIdAndDelete(req.params.id);

    res.json({ message: "Ride removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  joinRide,
  unjoinRide,
  updateRide,
  deleteRide,
};

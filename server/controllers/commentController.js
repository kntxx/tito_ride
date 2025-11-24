const Comment = require("../models/Comment");
const Ride = require("../models/Ride");
const { createBulkNotifications } = require("../utils/notificationHelper");

// @desc    Add comment to ride
// @route   POST /api/rides/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const rideId = req.params.id;

    // Check if ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const comment = await Comment.create({
      rideId,
      userId: req.user._id,
      name: req.user.name,
      profileImage: req.user.profileImage,
      text,
    });

    // Notify ride creator and all participants (except commenter)
    const io = req.app.get("io");
    if (io) {
      try {
        const notifyUserIds = new Set();

        // Add creator if different from commenter
        if (ride.creator.userId.toString() !== req.user._id.toString()) {
          notifyUserIds.add(ride.creator.userId.toString());
        }

        // Add all participants except commenter
        ride.participants.forEach((p) => {
          if (p.userId.toString() !== req.user._id.toString()) {
            notifyUserIds.add(p.userId.toString());
          }
        });

        if (notifyUserIds.size > 0) {
          await createBulkNotifications(io, Array.from(notifyUserIds), {
            type: "comment",
            rideId: ride._id,
            message: `💬 ${req.user.name} commented on: ${ride.title}`,
            triggeredBy: {
              userId: req.user._id,
              name: req.user.name,
              profileImage: req.user.profileImage,
            },
          });
        }
      } catch (error) {
        console.error("Error creating comment notifications:", error);
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a ride
// @route   GET /api/rides/:id/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ rideId: req.params.id }).sort({
      createdAt: -1,
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};

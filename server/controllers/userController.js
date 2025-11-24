const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// @desc    Upload profile picture
// @route   POST /api/users/:id/upload-profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user owns the account
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if it exists and is not default
    if (
      user.profileImage &&
      !user.profileImage.includes("ui-avatars.com") &&
      !user.profileImage.includes("cloudinary")
    ) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads/profile",
        path.basename(user.profileImage)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Generate image URL
    const imageUrl = `/uploads/profile/${req.file.filename}`;

    // Update user profile
    user.profileImage = imageUrl;
    await user.save();

    res.json({
      success: true,
      imageUrl: imageUrl,
      message: "Profile picture uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user owns the account
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const { name, bikeType, mtbLevel, emergencyContact } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (bikeType) user.bikeType = bikeType;
    if (mtbLevel) user.mtbLevel = mtbLevel;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(userId).select("-password");

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

module.exports = {
  uploadProfilePicture,
  getUserProfile,
  updateUserProfile,
};

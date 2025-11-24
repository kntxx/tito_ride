const express = require("express");
const router = express.Router();
const {
  uploadProfilePicture,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Get user profile (public)
router.get("/:id", getUserProfile);

// Update user profile (private)
router.put("/:id", protect, updateUserProfile);

// Upload profile picture (private)
router.post(
  "/:id/upload-profile-picture",
  protect,
  upload.single("profileImage"),
  uploadProfilePicture
);

module.exports = router;

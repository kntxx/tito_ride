const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/uploadMiddleware");

router.post("/register", uploadProfileImage, registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;

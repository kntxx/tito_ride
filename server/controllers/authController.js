const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bikeType,
      mtbLevel,
      emergencyContactName,
      emergencyContactPhone,
    } = req.body;

    // Parse emergencyContact from FormData
    const emergencyContact = {
      name: emergencyContactName,
      phone: emergencyContactPhone,
    };

    // Validate emergency contact
    if (!emergencyContact.name || !emergencyContact.phone) {
      return res.status(400).json({
        message: "Emergency contact name and phone are required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Handle profile image
    let profileImagePath = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;
    if (req.file) {
      profileImagePath = `/uploads/profile/${req.file.filename}`;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      bikeType,
      mtbLevel,
      emergencyContact,
      profileImage: profileImagePath,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bikeType: user.bikeType,
        mtbLevel: user.mtbLevel,
        emergencyContact: user.emergencyContact,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bikeType: user.bikeType,
        mtbLevel: user.mtbLevel,
        emergencyContact: user.emergencyContact,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bikeType: user.bikeType,
        mtbLevel: user.mtbLevel,
        emergencyContact: user.emergencyContact,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

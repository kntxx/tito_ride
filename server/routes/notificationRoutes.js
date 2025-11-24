const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  cleanupOldNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Create notification (internal use)
router.post("/", createNotification);

// Get user notifications with pagination
router.get("/user/:userId", getUserNotifications);

// Get unread count
router.get("/user/:userId/unread-count", getUnreadCount);

// Mark notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read
router.patch("/user/:userId/read-all", markAllAsRead);

// Cleanup old notifications (admin/cron job)
router.delete("/cleanup", cleanupOldNotifications);

module.exports = router;

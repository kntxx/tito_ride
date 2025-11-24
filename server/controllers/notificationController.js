const Notification = require("../models/Notification");

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, type, rideId, message, triggeredBy } = req.body;

    const notification = await Notification.create({
      userId,
      type,
      rideId,
      message,
      triggeredBy,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("rideId", "title meetupLocation meetupTime")
      .lean();

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ message: "Failed to mark all notifications as read" });
  }
};

// Delete old notifications (cleanup job)
const cleanupOldNotifications = async (req, res) => {
  try {
    const result = await Notification.cleanupOldNotifications();

    res.json({
      message: "Old notifications cleaned up",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
    res.status(500).json({ message: "Failed to cleanup notifications" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  cleanupOldNotifications,
};

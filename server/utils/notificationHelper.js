const Notification = require("../models/Notification");

/**
 * Create and emit a notification
 * @param {Object} io - Socket.IO instance
 * @param {Object} data - Notification data
 * @param {String} data.userId - Recipient user ID
 * @param {String} data.type - Notification type
 * @param {String} data.rideId - Related ride ID
 * @param {String} data.message - Notification message
 * @param {Object} data.triggeredBy - User who triggered the notification
 */
const createAndEmitNotification = async (io, data) => {
  try {
    const notification = await Notification.create(data);

    // Populate ride details
    await notification.populate("rideId", "title meetupLocation meetupTime");

    // Emit to specific user
    io.to(data.userId.toString()).emit("notification:new", notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Create notifications for multiple users
 * @param {Object} io - Socket.IO instance
 * @param {Array} userIds - Array of recipient user IDs
 * @param {Object} notificationData - Common notification data
 */
const createBulkNotifications = async (io, userIds, notificationData) => {
  try {
    const notifications = userIds.map((userId) => ({
      userId,
      ...notificationData,
    }));

    const created = await Notification.insertMany(notifications);

    // Populate and emit each notification
    for (let i = 0; i < created.length; i++) {
      await created[i].populate("rideId", "title meetupLocation meetupTime");
      io.to(userIds[i].toString()).emit("notification:new", created[i]);
    }

    return created;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
};

module.exports = {
  createAndEmitNotification,
  createBulkNotifications,
};

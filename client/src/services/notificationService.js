import api from "../utils/api";

// Get user notifications
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const response = await api.get(`/notifications/user/${userId}`, {
    params: { page, limit },
  });
  return response.data;
};

// Get unread count
export const getUnreadCount = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}/unread-count`);
  return response.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async (userId) => {
  const response = await api.patch(`/notifications/user/${userId}/read-all`);
  return response.data;
};

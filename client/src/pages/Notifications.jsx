import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../context/NotificationContext";
import {
  getUserNotifications,
  markAsRead as markNotificationAsRead,
  markAllAsRead as markAllNotificationsAsRead,
} from "../services/notificationService";
import NotificationItem from "../components/NotificationItem";
import PageHeader from "../components/ui/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const Notifications = () => {
  const { user } = useAuth();
  const {
    markAsRead,
    markAllAsRead,
    setUnreadCount,
    notifications: contextNotifications,
  } = useNotifications();

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  useEffect(() => {
    // Merge real-time notifications with fetched ones
    if (contextNotifications.length > 0) {
      setNotifications((prev) => {
        const newNotifications = [...contextNotifications];
        prev.forEach((n) => {
          if (!newNotifications.find((cn) => cn._id === n._id)) {
            newNotifications.push(n);
          }
        });
        return newNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
    }
  }, [contextNotifications]);

  const fetchNotifications = async (pageNum, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await getUserNotifications(user._id, pageNum, 20);

      let filteredNotifications = data.notifications;
      if (filter === "unread") {
        filteredNotifications = filteredNotifications.filter((n) => !n.isRead);
      }

      if (isInitial) {
        setNotifications(filteredNotifications);
      } else {
        setNotifications((prev) => [...prev, ...filteredNotifications]);
      }

      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user._id);
      markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        handleLoadMore();
      }
    },
    [hasMore, loadingMore]
  );

  if (loading) return <LoadingSpinner />;

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="min-h-screen pb-16">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your rides and community"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filter and Actions */}
        <div className="mb-6 glass-card rounded-2xl p-4 border border-[#26433C]/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-premium text-white shadow-md"
                    : "bg-white/50 text-gray-700 hover:bg-white/80"
                }`}
              >
                All
                <span className="ml-2 text-sm opacity-75">
                  ({notifications.length})
                </span>
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "unread"
                    ? "bg-gradient-premium text-white shadow-md"
                    : "bg-white/50 text-gray-700 hover:bg-white/80"
                }`}
              >
                Unread
                <span className="ml-2 text-sm opacity-75">
                  ({unreadNotifications.length})
                </span>
              </button>
            </div>

            {/* Mark All as Read */}
            {unreadNotifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="w-full sm:w-auto px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                ✓ Mark all as read
              </motion.button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div
          className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2"
          onScroll={handleScroll}
        >
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-12 text-center border border-[#26433C]/20"
            >
              <div className="text-8xl mb-6">🔔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600">
                You'll receive notifications about rides, comments, and more
              </p>
            </motion.div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </motion.div>
              ))}

              {/* Load More */}
              {loadingMore && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8A00]"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading more...</p>
                </div>
              )}

              {!hasMore && notifications.length > 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">
                    You've reached the end 🎉
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

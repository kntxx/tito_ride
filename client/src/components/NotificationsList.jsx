import { motion, AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";

const NotificationsList = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 text-sm">No notifications yet</p>
              <p className="text-gray-400 text-xs mt-1">
                You'll be notified about rides, comments, and more
              </p>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsList;

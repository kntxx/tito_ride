import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Avatar from "./ui/Avatar";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();

  const getTypeEmoji = (type) => {
    switch (type) {
      case "new_ride":
        return "🚵";
      case "ride_update":
        return "📍";
      case "join_ride":
        return "👤";
      case "comment":
        return "💬";
      default:
        return "🔔";
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    if (notification.rideId) {
      navigate(`/ride/${notification.rideId._id || notification.rideId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        notification.isRead
          ? "bg-white/50 border-gray-200/50 hover:bg-white/70"
          : "bg-gradient-to-r from-blue-50/90 to-purple-50/90 border-[#26433C]/30 hover:from-blue-50 hover:to-purple-50"
      }`}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        {/* User Avatar with Type Emoji Badge */}
        <div className="relative flex-shrink-0">
          <div className="relative">
            <Avatar
              src={notification.triggeredBy?.profileImage}
              alt={notification.triggeredBy?.name || "User"}
              size={40}
              className="ring-2 ring-[#0B1C1A]/20 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B1C1A] border-2 border-white flex items-center justify-center text-xs shadow-md">
              {getTypeEmoji(notification.type)}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm ${
              notification.isRead
                ? "text-gray-700 font-normal"
                : "text-gray-900 font-semibold"
            }`}
          >
            {notification.message}
          </p>

          {notification.rideId?.title && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {notification.rideId.title}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {!notification.isRead && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;

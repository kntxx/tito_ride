import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import Avatar from "../components/ui/Avatar";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to Socket.IO
      const socketInstance = io(
        import.meta.env.VITE_API_URL || "http://localhost:5000",
        {
          transports: ["websocket", "polling"],
        }
      );

      socketInstance.on("connect", () => {
        console.log("Connected to notification system");
        socketInstance.emit("join", user._id);
      });

      // Listen for new notifications
      socketInstance.on("notification:new", (notification) => {
        console.log("New notification received:", notification);

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        showNotificationToast(notification);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const showNotificationToast = (notification) => {
    const getIcon = (type) => {
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

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full glass-card shadow-lg rounded-2xl pointer-events-auto flex items-start p-4 border border-[#26433C]`}
          style={{
            background: "linear-gradient(135deg, #0B1C1A 0%, #1a3a35 100%)",
          }}
        >
          {/* User Avatar with Type Badge */}
          <div className="relative flex-shrink-0 mr-3">
            <div className="relative">
              <Avatar
                src={notification.triggeredBy?.profileImage}
                alt={notification.triggeredBy?.name || "User"}
                size={40}
                className="ring-2 ring-primary-400/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary-500 border-2 border-[#0B1C1A] flex items-center justify-center text-xs shadow-md">
                {getIcon(notification.type)}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">New Notification</p>
            <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ),
      {
        duration: 5000,
        position: "top-right",
      }
    );
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        setUnreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

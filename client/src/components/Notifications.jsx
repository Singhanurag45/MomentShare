import { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import api from "../services/api";

const NotificationText = ({ notification }) => {
  const actionText = {
    like: "liked your post.",
    comment: "commented on your post.",
    follow: "started following you.",
  };
  return (
    <p className="text-sm">
      <span className="font-semibold">{notification.sender.username}</span>{" "}
      {actionText[notification.type]}
    </p>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data));
    // In a real app, you might use WebSockets or polling for real-time updates
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark as read on the backend
      await api.post("/notifications/read");
      // Update frontend state
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button onClick={handleToggle} className="relative">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-10 right-0 w-80 bg-white dark:bg-surface border dark:border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-30">
          <div className="p-3 font-semibold border-b dark:border-border">
            Notifications
          </div>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`${
                    !notif.read ? "bg-blue-50 dark:bg-primary/10" : ""
                  }`}
                >
                  <Link
                    to={
                      notif.type === "follow"
                        ? `/${notif.sender.username}`
                        : `/post/${notif.post}`
                    }
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <img
                      src={notif.sender.profilePicture}
                      alt={notif.sender.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <NotificationText notification={notif} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-gray-500">No new notifications.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

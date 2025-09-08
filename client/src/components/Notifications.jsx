import { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import api from "../services/api";
import UserAvatar from "./UserAvatar";

const NotificationText = ({ notification }) => {
  const actionText = {
    like: "liked your post.",
    comment: "commented on your post.",
    follow: "started following you.",
  };
  return (
    <p className="text-sm text-gray-800 dark:text-text-primary">
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
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      await api.post("/notifications/read");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={handleToggle}
        className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <BellIcon className="h-6 w-6 text-gray-700 dark:text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-background">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          <div className="p-3 font-semibold border-b border-gray-100 dark:border-border text-gray-800 dark:text-text-primary">
            Notifications
          </div>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`border-b border-gray-50 dark:border-border last:border-none ${!notif.read ? "bg-blue-50/50 dark:bg-primary/10" : ""}`}
                >
                  <Link
                    to={
                      notif.type === "follow"
                        ? `/${notif.sender.username}`
                        : `/post/${notif.post}`
                    }
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <UserAvatar
                        user={notif.sender}
                        size="w-10 h-10"
                        textSize="text-sm"
                      />
                    </div>
                    <div className="flex-grow">
                      <NotificationText notification={notif} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500 dark:text-text-secondary">
              No new notifications.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default Notifications;

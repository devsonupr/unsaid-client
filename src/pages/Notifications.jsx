import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sampleNotifications = [
  {
    id: 1,
    message: "Your profile was updated successfully.",
    type: "success",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    message: "New comment on your post.",
    type: "info",
    time: "10 mins ago",
    read: true,
  },
  {
    id: 3,
    message: "Server error occurred.",
    type: "error",
    time: "1 hour ago",
    read: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch from API later
    setNotifications(sampleNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "error":
        return <AlertCircle className="text-red-500 w-5 h-5" />;
      default:
        return <Bell className="text-blue-500 w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`flex items-start gap-4 p-4 cursor-pointer transition ${
                notif.read
                  ? "bg-white dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <div>{getIcon(notif.type)}</div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    notif.read
                      ? "text-gray-600 dark:text-gray-300"
                      : "font-semibold"
                  }`}
                >
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

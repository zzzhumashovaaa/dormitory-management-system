import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/my");
      setNotifications(response.data);
    } catch (error) {
      console.log("NOTIFICATIONS ERROR:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.log("MARK READ ERROR:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (error) {
      console.log("MARK ALL READ ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPLICATION_APPROVED":
        return "✅";
      case "APPLICATION_REJECTED":
        return "❌";
      case "ROOM_ASSIGNED":
        return "🏠";
      case "COMPLAINT_UPDATED":
        return "🛠️";
      default:
        return "🔔";
    }
  };

  const openNotification = async (notification) => {
    console.log("CLICKED NOTIFICATION:", notification);

    try {
      if (!notification.readStatus) {
        await api.put(`/notifications/${notification.id}/read`);
      }

      if (!notification.applicationId) {
        alert("This notification is not linked to an application.");
        return;
      }

      if (role === "STUDENT") {
        navigate(`/student/applications/${notification.applicationId}`);
      } else {
        navigate(`/applications/${notification.applicationId}`);
      }
    } catch (error) {
      console.log("OPEN NOTIFICATION ERROR:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Stay updated with dormitory activity
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-5">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => openNotification(notification)}
            className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 transition hover:shadow-md cursor-pointer ${
              notification.readStatus ? "border-gray-200" : "border-blue-600"
            }`}
          >
            <div className="flex justify-between items-start gap-5">
              <div className="flex gap-4">
                <div className="text-3xl">
                  {getNotificationIcon(notification.type)}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold">
                      {notification.title}
                    </h2>

                    {!notification.readStatus && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">
                    {notification.message}
                  </p>

                  <p className="text-sm text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>

              {!notification.readStatus && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    markAsRead(notification.id);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Read
                </button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-5">🔔</div>

            <h2 className="text-2xl font-bold mb-2">
              No notifications yet
            </h2>

            <p className="text-gray-500">
              You’ll see updates about applications, rooms, complaints, and more.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
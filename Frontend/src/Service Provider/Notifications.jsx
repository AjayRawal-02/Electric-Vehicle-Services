import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/auth/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  const clearNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/auth/notifications/clear", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Notifications cleared!");
    setNotifications([]);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600 text-lg">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((note, index) => (
            <div key={index} className="bg-white shadow p-4 rounded-md">
              <p className="text-gray-700">{note.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <button
          onClick={clearNotifications}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default Notifications;

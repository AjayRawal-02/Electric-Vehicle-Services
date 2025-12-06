import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view your bookings");
          setLoading(false);
          return;
        }

        const response = await fetch("https://electric-vehicle-services.onrender.com/api/bookings/my-bookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading your bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No bookings found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Bookings</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Service</th>
              <th className="py-3 px-4 border-b">Vehicle</th>
              <th className="py-3 px-4 border-b">Model</th>
              <th className="py-3 px-4 border-b">Preferred Time</th>
              <th className="py-3 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border-b">{booking.service}</td>
                <td className="py-2 px-4 border-b">{booking.vehicle}</td>
                <td className="py-2 px-4 border-b">{booking.model}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(booking.preferredTime).toLocaleString()}
                </td>
                <td
                  className={`py-2 px-4 border-b font-semibold ${
                    booking.status === "pending"
                      ? "text-yellow-600"
                      : booking.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;

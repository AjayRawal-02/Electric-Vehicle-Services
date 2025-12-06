import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();    

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      toast.error("Please login to see bookings");
      return;
    }

    try {
      const res = await fetch("https://electric-vehicle-services.onrender.com/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        toast.error(data.message || "Failed to load bookings");
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.log(error);
      toast.error("Server error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);



  const handleCancel = async (bookingId) => {
  const token = localStorage.getItem("token");
console.log(token)
console.log(bookingId)
  try {
    const res = await fetch(`https://electric-vehicle-services.onrender.com/api/bookings/cancel/${bookingId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Booking canceled successfully!");
    fetchBookings(); // Refresh the list
  } catch (error) {
    toast.error("Cancel failed!");
  }
};

  return (
    <div className="min-h-screen bg-[#f0fcf4] p-4 sm:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-center text-lg font-semibold text-gray-600">
          Loading bookings...
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-600">
          No bookings found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {booking.service}
              </h2>
              <p className="text-gray-600">
  📍 Location: {booking.location?.address}
</p>

              <p className="text-gray-600">
                📅 Date: {new Date(booking.preferredTime).toLocaleDateString()}
              </p>
             <p className="text-gray-600">
  ⏱ Time: {new Date(booking.preferredTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</p>

              <p
  className={`font-bold mt-2 ${
    booking.status === "completed" ? "text-green-600"
    : booking.status === "pending" ? "text-orange-500"
    : booking.status === "cancelled" ? "text-red-600"
    : booking.status === "accepted" ? "text-blue-500"
    : booking.status === "quoted" ? "text-purple-600"
    : "text-gray-600"
  }`}
>
  Status: {booking.status}
</p>

{booking.status === "quoted" && (
  <button
    className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
    onClick={() => navigate(`/quotes/${booking._id}`)}
  >
    View Quotes
  </button>
)}


              {/* Buttons */}
              <div className="flex justify-between mt-4">
                {booking.status === "pending" && (
                  <button
  className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
  onClick={() => handleCancel(booking._id)}
>
  Cancel
</button>

                )}

               <button
  className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
  onClick={() => navigate(`/track/${booking._id}`)}
>
  Track
</button>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

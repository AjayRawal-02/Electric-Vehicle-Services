import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ServiceProviderDashboard = () => {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
console.log("Token:", token);


  // Fetch both pending and accepted bookings
  const fetchBookings = async () => {
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        fetch("https://electric-vehicle-services.onrender.com/api/provider/bookings/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://electric-vehicle-services.onrender.com/api/provider/bookings/accepted", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const pendingData = await pendingRes.json();
      const acceptedData = await acceptedRes.json();
console.log("Pending API Response:", pendingData);
console.log("Accepted API Response:", acceptedData);
      if (!pendingRes.ok) throw new Error(pendingData.message);
      if (!acceptedRes.ok) throw new Error(acceptedData.message);

      setPending(pendingData);
      setAccepted(acceptedData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // Accept Booking
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`https://electric-vehicle-services.onrender.com/api/provider/bookings/${id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceQuoted: 500, // you can replace with an input field later
          providerNotes: "Service accepted and scheduled soon",
        }),
      });
  
      const data = await res.json();
      console.log("Accept API Response:", data);
  
      if (!res.ok) throw new Error(data.message || "Accept failed");
  
      toast.success("Booking accepted successfully!");
      setPending((p) => p.filter((b) => b._id !== id)); // remove accepted one
    } catch (err) {
      console.error("Error accepting booking:", err);
      toast.error(err.message || "Accept failed");
    }
  };

  // Reject Booking
  const handleReject = async (id) => {
    try {
      const res = await fetch(`https://electric-vehicle-services.onrender.com/api/provider/bookings/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerNotes: "Not available for this request",
        }),
      });
  
      const data = await res.json();
      console.log("Reject API Response:", data);
  
      if (!res.ok) throw new Error(data.message || "Reject failed");
  
      toast.info("Booking rejected successfully!");
      setPending((p) => p.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error rejecting booking:", err);
      toast.error(err.message || "Reject failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const activeBookings = activeTab === "pending" ? pending : accepted;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Service Provider Dashboard</h2>

      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded ${
            activeTab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Pending Bookings
        </button>
        <button
          onClick={() => setActiveTab("accepted")}
          className={`px-4 py-2 rounded ${
            activeTab === "accepted" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Accepted Bookings
        </button>
      </div>

      {/* 🔹 Booking Cards */}
      {activeBookings.length === 0 ? (
        <p>No {activeTab} bookings right now.</p>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((b) => (
            <div
              key={b._id}
              className="p-4 border rounded-md shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-semibold">
                  {b.service} — {b.vehicle} / {b.model}
                </div>
                <div className="text-sm text-gray-600">
                  {b.address} • {new Date(b.preferredTime).toLocaleString()}
                </div>
                <div className="text-sm mt-2">
                  Customer: {b.customer?.name} • {b.customer?.phone}
                </div>
              </div>

              {activeTab === "pending" ? (
                <div className="mt-3 md:mt-0 flex gap-2">
                  <button
                    onClick={() => handleAccept(b._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(b._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="mt-3 md:mt-0 text-green-600 font-medium">
                  ✅ Accepted
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;

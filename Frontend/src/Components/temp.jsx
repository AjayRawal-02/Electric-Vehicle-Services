// src/components/ServiceProviderDashboard.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ServiceProviderDashboard = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("https://electric-vehicle-services.onrender.com/api/provider/bookings/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setPending(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error fetching pending bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [token]);

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pending Bookings</h2>
      {pending.length === 0 ? (
        <p>No pending bookings right now.</p>
      ) : (
        <div className="space-y-4">
          {pending.map((b) => (
            <div key={b._id} className="p-4 border rounded-md shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{b.service} — {b.vehicle} / {b.model}</div>
                <div className="text-sm text-gray-600">{b.address} • {new Date(b.preferredTime).toLocaleString()}</div>
                <div className="text-sm mt-2">Customer: {b.customer?.name} • {b.customer?.phone}</div>
              </div>
              <div className="mt-3 md:mt-0 flex gap-2">
                <button onClick={() => handleAccept(b._id)} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
                <button onClick={() => handleReject(b._id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;

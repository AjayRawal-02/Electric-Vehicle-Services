import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Home_ServiceProvider = () => {
  const [username, setUsername] = useState("");
  const [liveRequests, setLiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});
  const [activeJob, setActiveJob] = useState(null);
  const [summary, setSummary] = useState({
  newRequests: 0,
  activeJobs: 0,
  earningsToday: 0,
  rating: 0,
});


  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUsername(parsed.name);
    }

    fetchLiveRequests();
  }, []);

  const fetchLiveRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:5000/api/provider/bookings/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      setLiveRequests(data);
    } catch {
      toast.error("Failed to load requests");
    }
    setLoading(false);
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/provider/bookings/${id}/accept`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Booking Accepted");
    fetchLiveRequests(); // refresh list
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/provider/bookings/${id}/reject`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Booking Rejected");
    fetchLiveRequests(); // refresh list
  };

  const submitQuote = async (id, price) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/provider/bookings/${id}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ price })
  });

  const data = await res.json();
  if (res.ok) toast.success("Quote sent!");
  else toast.error(data.message);
};

const fetchActiveJob = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/provider/active-job", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  setActiveJob(data.job);
};

// useEffect(() => {
//   fetchLiveRequests();
//   fetchActiveJob();   // ⬅ add here
// }, []);

const completeJob = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5000/api/provider/active-job/complete/${id}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  if (res.ok) {
    toast.success("Job Completed");
    setActiveJob(null);
    fetchLiveRequests(); // refresh UI
  } else {
    toast.error(data.message);
  }
};

const fetchSummary = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/provider/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setSummary(data);
};
useEffect(() => {
  fetchLiveRequests();
  fetchActiveJob();
  fetchSummary();   // ⬅ NEW
}, []);

// 🔥 Send Live GPS location every 5 sec when active job exists
useEffect(() => {
  if (!activeJob) return;
  const token = localStorage.getItem("token");

  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetch("http://localhost:5000/api/provider/update-location", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            bookingId: activeJob._id
          })
        });
      },
      () => console.log("Location permission denied")
    );
  }, 5000);

  return () => clearInterval(interval);
}, [activeJob]);


  return (
    <div className="p-5 sm:p-8 bg-[#f7fafb] min-h-screen">
      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Welcome back, {username} 👋
      </h1>
      <p className="text-gray-500 mt-1">
        Dedicated to helping EV users — you're on duty today 🚗⚡
      </p>

     {/* Summary Cards */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">

  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold text-blue-700">{summary.newRequests}</h2>
    <p className="text-gray-600 text-sm">New Requests</p>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold text-blue-700">{summary.activeJobs}</h2>
    <p className="text-gray-600 text-sm">Active Jobs</p>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold text-blue-700">₹{summary.earningsToday}</h2>
    <p className="text-gray-600 text-sm">Earnings (Today)</p>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold text-blue-700">{summary.rating} ★</h2>
    <p className="text-gray-600 text-sm">Rating</p>
  </div>

</div>


      {/* Live Requests */}
      {/* Live Requests */}
<h2 className="text-xl font-semibold mt-8 mb-3">Live Service Requests</h2>
{loading ? (
  <p>Loading requests...</p>
) : liveRequests.length === 0 ? (
  <p className="text-gray-600">No new requests right now</p>
) : (
  <div className="grid gap-4">
  {liveRequests.map((req) => (
    <div key={req._id} className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-blue-700">{req.service}</h3>

      <p className="text-sm text-gray-600 mt-1">
        Customer: {req.customer.name} • {req.distance} km away
      </p>

      {/* Problem details */}
      {req.additionalDetails && (
        <p className="text-gray-700 text-sm bg-gray-100 p-2 rounded mt-2">
          <b>Issue:</b> {req.additionalDetails}
        </p>
      )}

      {/* PRICE INPUT */}
      <div className="flex gap-2 mt-3">
        <input
          type="number"
          className="border p-2 rounded w-40"
          placeholder="Enter your quote (₹)"
          value={price[req._id] || ""}
          onChange={(e) =>
            setPrice((prev) => ({ ...prev, [req._id]: e.target.value }))
          }
        />
        <button
          onClick={() => submitQuote(req._id, price[req._id])}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Send Quote
        </button>
      </div>

      {/* Reject Only */}
      <button
        onClick={() => handleReject(req._id)}
        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Reject
      </button>
    </div>
  ))}
</div>

)}

     <h2 className="text-xl font-semibold mt-8 mb-3">Active Job</h2>
{activeJob ? (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <p className="font-semibold text-blue-700">{activeJob.service}</p>

    {/* Customer Name */}
    <p className="text-sm text-gray-600">
      Customer: {activeJob.customer?.name}
    </p>

    {/* Address */}
    <p className="text-sm text-gray-600">
      Location: {activeJob.location?.address}
    </p>

    {/* Job Start Time */}
    <p className="text-sm text-gray-600">
      Started at: {new Date(activeJob.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </p>

    <div className="flex gap-3 mt-3">
      <button
  onClick={() => navigate(`/track/${activeJob._id}`)}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
>
  Track Location
</button>


      <button
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow"
        onClick={() => completeJob(activeJob._id)}
      >
        Mark Completed
      </button>
    </div>
  </div>
) : (
  <p className="text-gray-600">No active job at the moment 👍</p>
)}

      
    </div>
  );
};

export default Home_ServiceProvider;

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home_ServiceProvider = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [liveRequests, setLiveRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [price, setPrice] = useState({});
  const [otp, setOtp] = useState("");

  const [summary, setSummary] = useState({
    newRequests: 0,
    activeJobs: 0,
    earningsToday: 0,
    rating: 0,
  });

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setUsername(JSON.parse(user).name);

    fetchLiveRequests();
    fetchActiveJob();
    fetchSummary();
  }, []);

  /* -------------------- FETCH REQUESTS -------------------- */
  const fetchLiveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://electric-vehicle-services.onrender.com/api/provider/bookings/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (!res.ok) return toast.error(data.message);
      setLiveRequests(data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- SUBMIT QUOTE -------------------- */
  const submitQuote = async (bookingId, amount) => {
    if (!amount) return toast.error("Enter quote amount");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://electric-vehicle-services.onrender.com/api/provider/bookings/${bookingId}/quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price: amount }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Quote sent successfully");
      setPrice((p) => ({ ...p, [bookingId]: "" }));
      fetchLiveRequests();
    } catch {
      toast.error("Failed to send quote");
    }
  };

  /* -------------------- REJECT -------------------- */
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://electric-vehicle-services.onrender.com/api/provider/bookings/${id}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Request rejected");
      fetchLiveRequests();
    } catch {
      toast.error("Reject failed");
    }
  };

  /* -------------------- ACTIVE JOB -------------------- */
  const fetchActiveJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://electric-vehicle-services.onrender.com/api/provider/active-job",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setActiveJob(data.job || null);
    } catch {
      toast.error("Failed to load active job");
    }
  };

  /* -------------------- OTP VERIFY -------------------- */
  const verifyOTP = async (bookingId) => {
    if (!otp) return toast.error("Enter OTP");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://electric-vehicle-services.onrender.com/api/provider/verify-otp/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Job completed successfully");
      setOtp("");
      setActiveJob(null);
      fetchLiveRequests();
      fetchSummary();
    } catch {
      toast.error("OTP verification failed");
    }
  };

  /* -------------------- SUMMARY -------------------- */
  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://electric-vehicle-services.onrender.com/api/provider/summary",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSummary(data);
    } catch {}
  };

  /* -------------------- LIVE LOCATION -------------------- */
  useEffect(() => {
    if (!activeJob) return;

    const token = localStorage.getItem("token");
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await fetch(
          "https://electric-vehicle-services.onrender.com/api/provider/update-location",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              bookingId: activeJob._id,
            }),
          }
        );
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeJob]);

  const requestCompletionOTP = async (bookingId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://electric-vehicle-services.onrender.com/api/provider/active-job/request-otp/${bookingId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (res.ok) {
    toast.success("OTP sent to customer");
    fetchActiveJob(); // refresh job status
  } else {
    toast.error(data.message);
  }
};

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 bg-[#f7fafb] min-h-screen">
      <h1 className="text-3xl font-semibold">Welcome back, {username} 👋</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          ["New Requests", summary.newRequests],
          ["Active Jobs", summary.activeJobs],
          ["Earnings Today", `₹${summary.earningsToday}`],
          ["Rating", `${summary.rating} ★`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-xl font-bold text-blue-700">{value}</h2>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* LIVE REQUESTS */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Live Service Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : liveRequests.length === 0 ? (
        <p>No new requests</p>
      ) : (
        <div className="grid gap-4">
          {liveRequests.map((req) => (
            <div key={req._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-blue-700">{req.service}</h3>
              <p className="text-sm text-gray-600">
                Customer: {req.customer.name}
              </p>

              {req.additionalDetails && (
                <p className="bg-gray-100 p-2 mt-2 rounded text-sm">
                  <b>Issue:</b> {req.additionalDetails}
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  placeholder="Enter quote ₹"
                  className="border p-2 rounded w-40"
                  value={price[req._id] || ""}
                  onChange={(e) =>
                    setPrice({ ...price, [req._id]: e.target.value })
                  }
                />
                <button
                  onClick={() => submitQuote(req._id, price[req._id])}
                  className="bg-green-600 text-white px-4 rounded"
                >
                  Send Quote
                </button>
              </div>

              <button
                onClick={() => handleReject(req._id)}
                className="mt-3 bg-red-600 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE JOB */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Active Job</h2>

      {activeJob ? (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-semibold text-blue-700">{activeJob.service}</p>
          <p className="text-sm">Customer: {activeJob.customer?.name}</p>
          <p className="text-sm">
            Location: {activeJob.location?.address}
          </p>

          <button
            onClick={() => navigate(`/track/${activeJob._id}`)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Track Location
          </button>

         {/* STEP 1: Provider requests OTP */}
{activeJob.status === "accepted" && (
  <button
    onClick={() => requestCompletionOTP(activeJob._id)}
    className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded w-full"
  >
    Mark Service Completed
  </button>
)}

{/* STEP 2: Provider verifies OTP */}
{activeJob.status === "waiting_customer_verification" && (
  <div className="mt-4">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="border p-2 rounded w-full mb-2"
    />

    <button
      onClick={() => verifyOTP(activeJob._id)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
    >
      Verify OTP & Complete Job
    </button>
  </div>
)}

        </div>
      ) : (
        <p>No active job right now 👍</p>
      )}
    </div>
  );
};

export default Home_ServiceProvider;

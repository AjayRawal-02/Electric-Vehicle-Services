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
console.log(activeJob)
  /* -------------------- UI -------------------- */
 return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef7f3] to-[#f9fbff] p-4 sm:p-8">
    {/* HEADER */}
    <div className="relative mb-10 rounded-3xl overflow-hidden">
  {/* Gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500" />

  {/* Glass overlay */}
  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

  {/* Content */}
  <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white">
    <div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Welcome back, <span className="text-yellow-300">{username}</span> 👋
      </h1>
      <p className="text-white/80 mt-2 text-sm sm:text-base">
        Ready to accept new service requests today?
      </p>
    </div>

    {/* Right badge */}
    <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-white/20 px-5 py-3 rounded-2xl shadow-inner">
      <span className="text-2xl">🛠️</span>
      <div>
        <p className="text-xs uppercase tracking-wider opacity-80">
          Dashboard
        </p>
        <p className="font-semibold">Service Provider</p>
      </div>
    </div>
  </div>

  {/* Decorative blobs */}
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
</div>


    {/* SUMMARY */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
  {[
    {
      label: "New Requests",
      value: summary.newRequests,
      icon: "📥",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      label: "Active Jobs",
      value: summary.activeJobs,
      icon: "🛠️",
      gradient: "from-orange-500 to-amber-400",
    },
    {
      label: "Earnings Today",
      value: `₹${summary.earningsToday}`,
      icon: "💰",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      label: "Rating",
      value: `${summary.rating} ★`,
      icon: "⭐",
      gradient: "from-purple-500 to-pink-400",
    },
  ].map((card) => (
    <div
      key={card.label}
      className={`
        relative overflow-hidden rounded-2xl p-6 text-white
        bg-gradient-to-br ${card.gradient}
        shadow-xl hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      `}
    >
      {/* Glass blur layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{card.label}</p>
          <h2 className="text-3xl font-extrabold mt-1 tracking-tight">
            {card.value}
          </h2>
        </div>

        {/* Icon bubble */}
        <div className="text-4xl bg-white/20 rounded-full p-3 shadow-inner">
          {card.icon}
        </div>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
    </div>
  ))}
</div>


    {/* LIVE REQUESTS */}
    <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">
      🔔 Live Service Requests
    </h2>

    {loading ? (
      <p className="text-gray-600">Loading requests...</p>
    ) : liveRequests.length === 0 ? (
      <p className="text-gray-500 bg-white p-4 rounded-lg shadow">
        No new requests right now 🚀
      </p>
    ) : (
      <div className="grid md:grid-cols-2 gap-5">
        {liveRequests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              {req.service}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              👤 Customer: <b>{req.customer.name}</b>
            </p>

            {req.additionalDetails && (
              <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                <b>Issue:</b> {req.additionalDetails}
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              <input
                type="number"
                placeholder="Quote ₹"
                className="border p-2 rounded w-full"
                value={price[req._id] || ""}
                onChange={(e) =>
                  setPrice({ ...price, [req._id]: e.target.value })
                }
              />
              <button
                onClick={() => submitQuote(req._id, price[req._id])}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>

            <button
              onClick={() => handleReject(req._id)}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Reject Request
            </button>
          </div>
        ))}
      </div>
    )}

    {/* ACTIVE JOB */}
    <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">
      🚧 Active Job
    </h2>

    {activeJob ? (
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
        <h3 className="text-xl font-semibold text-green-700">
          {activeJob.service}
        </h3>
        <p className="text-sm mt-1">
          👤 Customer: {activeJob.customer?.name}
        </p>
        <p className="text-sm">
          📍 Location: {activeJob.location?.address}
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => navigate(`/track/${activeJob._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Track Location
          </button>

          {activeJob.status === "accepted" && (
            <button
              onClick={() => requestCompletionOTP(activeJob._id)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
            >
              Mark Completed
            </button>
          )}
        </div>

        {activeJob.status === "waiting_customer_verification" && (
          <div className="mt-5 bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">
              🔐 Enter OTP shared by customer
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />
            <button
              onClick={() => verifyOTP(activeJob._id)}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
            >
              Verify OTP & Complete Job
            </button>
          </div>
        )}
      </div>
    ) : (
      <p className="text-gray-500 bg-white p-4 rounded shadow">
        No active job right now 👍
      </p>
    )}
  </div>
);

};

export default Home_ServiceProvider;

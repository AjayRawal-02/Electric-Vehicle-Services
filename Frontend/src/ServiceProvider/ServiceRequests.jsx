import React, { useEffect, useState } from "react";

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
useEffect(() => {
  fetchRequests();
}, []);

const fetchRequests = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("https://electric-vehicle-services.onrender.com/api/provider/service-history", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  setRequests(data);
};


  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef7f3] to-[#f9fbff] p-4 sm:p-8">
    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        🧾 Service History
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Your completed and past service requests
      </p>
    </div>

    {/* EMPTY STATE */}
    {requests.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-xl font-semibold text-gray-800">
          No Service History Yet
        </h2>
        <p className="text-gray-500 mt-2 max-w-md">
          You haven’t completed any service requests yet.  
          Once you finish a job, it will appear here.
        </p>
      </div>
    ) : (
      <div className="space-y-5">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 
              border-green-500 p-5"
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h3 className="text-lg font-semibold text-blue-700">
                {req.service}
              </h3>

              <span
                className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    req.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {req.status.toUpperCase()}
              </span>
            </div>

            {/* DETAILS */}
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>👤 Customer: <b>{req.customer?.name || "N/A"}</b></p>
              <p>
                📅{" "}
                {new Date(req.updatedAt).toLocaleDateString()} •{" "}
                {new Date(req.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-bold text-green-700">
                ₹{req.finalPrice}
              </p>

              <span className="text-xs text-gray-400">
                Payment Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default ServiceRequests;

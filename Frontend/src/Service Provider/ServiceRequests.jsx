import React, { useEffect, useState } from "react";

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
useEffect(() => {
  fetchRequests();
}, []);

const fetchRequests = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/provider/service-history", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  setRequests(data);
};


  return (
    <div className="p-6 bg-[#f7fafb] min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Service Requests History</h1>

      {requests.map((req) => (
  <div key={req._id} className="bg-white p-4 rounded-md shadow mb-4">
    <h3 className="text-lg font-semibold text-blue-700">{req.service}</h3>

    <p className="text-gray-600 text-sm">
      Customer: {req.customer?.name}
    </p>

    <p className="text-gray-600 text-sm">
      Date: {new Date(req.updatedAt).toLocaleDateString()} • 
      Time: {new Date(req.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </p>

    <p className="text-green-700 font-bold mt-1">
      Earnings: ₹{req.finalPrice}
    </p>

    <span
      className={`px-3 py-1 rounded text-sm mt-2 inline-block ${
        req.status === "completed"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800"
      }`}
    >
      {req.status}
    </span>
  </div>
))}

    </div>
  );
};

export default ServiceRequests;

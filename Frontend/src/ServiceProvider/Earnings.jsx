import React, { useEffect, useState } from "react";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
  const fetchEarnings = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://electric-vehicle-services.onrender.com/api/provider/earnings", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setEarnings(data.earnings || []);
  };

  fetchEarnings();
}, []);


  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);


  return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef7f3] to-[#f9fbff] p-4 sm:p-8">
    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        💰 My Earnings
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Track your income from completed services
      </p>
    </div>

    {/* TOTAL EARNINGS CARD */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6 mb-8">
      <p className="text-sm opacity-90">Total Earnings</p>
      <h2 className="text-4xl font-bold mt-1">₹{totalEarnings}</h2>
    </div>

    {/* EMPTY STATE */}
    {earnings.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="text-6xl mb-4">📉</div>
        <h2 className="text-xl font-semibold text-gray-800">
          No Earnings Yet
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          You haven’t completed any paid services yet.  
          Once you start finishing jobs, your earnings will appear here.
        </p>
      </div>
    ) : (
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Service</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e, i) => (
              <tr
                key={i}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td className="p-4">{e.service}</td>
                <td className="p-4 text-right font-semibold text-green-600">
                  ₹{e.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

};

export default Earnings;

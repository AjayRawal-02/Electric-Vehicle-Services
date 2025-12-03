import React, { useEffect, useState } from "react";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
  const fetchEarnings = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/provider/earnings", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setEarnings(data.earnings || []);
  };

  fetchEarnings();
}, []);


  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);


  return (
    <div className="p-6 bg-[#f7fafb] min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">My Earnings</h1>

      <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold text-green-800">
          Total Earnings: ₹{totalEarnings}
        </h2>
      </div>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white text-left">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Service</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((e) => (
            <tr key={e.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{e.date}</td>
              <td className="p-3">{e.service}</td>
              <td className="p-3 font-semibold text-green-700">₹{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Earnings;

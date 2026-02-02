import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CustomerQuotes = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
const [selectedQuote, setSelectedQuote] = useState(null);


  const fetchQuotes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://electric-vehicle-services.onrender.com/api/bookings/quotes/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      setQuotes(data.quotes);
    } catch {
      toast.error("Failed to load quotes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // ⬅⬅ Correct Accept Quote
  const acceptQuote = async (bookingId, providerId, paymentMode) => {
  const token = localStorage.getItem("token");

  const res = await fetch("https://electric-vehicle-services.onrender.com/api/bookings/accept-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bookingId,
      providerId,
      paymentMode
    })
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("Quote accepted!");
    navigate(`/track/${bookingId}`); // 🔥 go to active job
  } else {
    toast.error(data.message);
  }
};


  if (loading)
    return <h2 className="text-center mt-10 text-lg">Loading quotes...</h2>;

  if (quotes.length === 0)
    return <h2 className="text-center mt-10 text-lg">No Quotes Received Yet</h2>;

  return (
    <div className="min-h-screen bg-[#f0fcf4] p-5 sm:p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Quotes Received 💬
      </h1>

      <div className="max-w-2xl mx-auto space-y-4">
        {quotes.map((q) => (
          <div key={q.provider._id} className="border p-4 rounded shadow bg-white">
            <p className="font-semibold">🔧 Provider: {q.provider.name}</p>
            <p className="text-lg font-bold text-blue-700">💰 Price: ₹{q.price}</p>

            {q.status === "accepted" ? (
              <span className="text-green-600 font-semibold">✔ Accepted</span>
            ) : q.status === "rejected" ? (
              <span className="text-red-600 font-semibold">✖ Rejected</span>
            ) : (
              <button
  onClick={() => setSelectedQuote(q)}
  className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
>
  Accept Quote
</button>

            )}
          </div>
        ))}
      </div>
      {selectedQuote && (
  <div className="bg-white p-4 rounded shadow mt-6">
    <h3 className="font-semibold text-lg mb-3">Choose Payment Method</h3>

    <div className="space-y-3">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="cash"
          onChange={() => setSelectedPayment("cash")}
        />
        Cash on Service
      </label>

      <label className="flex items-center gap-2 text-gray-400">
        <input type="radio" disabled />
        Online Payment (Coming Soon 🚧)
      </label>
    </div>

    <button
      disabled={!selectedPayment}
      onClick={() =>
        acceptQuote(
          bookingId,
          selectedQuote.provider._id,
          selectedPayment
        )
      }
      className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      Confirm & Continue
    </button>
  </div>
)}

    </div>
  );
};

export default CustomerQuotes;

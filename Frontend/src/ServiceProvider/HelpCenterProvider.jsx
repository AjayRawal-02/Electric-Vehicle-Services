import React from "react";

const HelpCenterProvider = () => {
 return (
  <div className="min-h-screen bg-gradient-to-br from-[#eef7f3] to-[#f9fbff] p-4 sm:p-10">
    {/* HEADER */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-800">
        🛠️ Provider Help Center
      </h1>
      <p className="text-gray-500 mt-2 max-w-xl mx-auto">
        Everything you need to know about handling service requests, quotes,
        jobs, and earnings.
      </p>
    </div>

    <div className="max-w-4xl mx-auto space-y-6">
      {/* FAQ CARD */}
      {[
        {
          q: "How do I receive service requests?",
          a: "When a customer creates a booking, it appears instantly in your Live Requests section.",
          icon: "📩",
        },
        {
          q: "How do I send a quote?",
          a: "Enter your price in the quote field and click 'Send Quote'. The customer will review and accept or reject it.",
          icon: "💰",
        },
        {
          q: "When does a job become active?",
          a: "A job becomes active only after the customer accepts your quote.",
          icon: "🚧",
        },
        {
          q: "How does job completion work?",
          a: "After completing the service, request the OTP from the customer and verify it to mark the job as completed.",
          icon: "🔐",
        },
        {
          q: "How are earnings calculated?",
          a: "Earnings are calculated based on successfully completed jobs and accepted quotes.",
          icon: "📊",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex gap-4"
        >
          <div className="text-3xl">{item.icon}</div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {item.q}
            </h3>
            <p className="text-gray-600 mt-2">{item.a}</p>
          </div>
        </div>
      ))}

      {/* INFO / WARNING */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
        <p className="text-sm text-gray-700">
          ⚠ <b>Professionalism matters.</b> Your ratings and behavior directly
          affect how often you receive new service requests. Provide quality
          service and maintain good communication.
        </p>
      </div>
    </div>
  </div>
);

};

export default HelpCenterProvider;

import React from "react";

const HelpCenterProvider = () => {
  return (
    <div className="min-h-screen bg-[#f7fafb] p-5 sm:p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Provider Help Center 🛠️
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How do I receive service requests?</h3>
          <p className="text-gray-600 mt-2">
            When a customer creates a booking, it appears in your Live Requests
            section.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How do I send a quote?</h3>
          <p className="text-gray-600 mt-2">
            Enter your price in the quote field and click "Send Quote".
            The customer will review and decide.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">When does a job become active?</h3>
          <p className="text-gray-600 mt-2">
            A job becomes active only after the customer accepts your quote.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How does job completion work?</h3>
          <p className="text-gray-600 mt-2">
            After completing the service, ask the customer for the OTP and verify it
            to mark the job as completed.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How are earnings calculated?</h3>
          <p className="text-gray-600 mt-2">
            Earnings are calculated based on completed jobs and accepted quotes.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            ⚠ Maintain professionalism. Ratings affect your future job visibility.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HelpCenterProvider;

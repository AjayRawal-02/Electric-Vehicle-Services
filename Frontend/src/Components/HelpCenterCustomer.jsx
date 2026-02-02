import React from "react";

const HelpCenterCustomer = () => {
  return (
    <div className="min-h-screen bg-[#f7fafb] p-5 sm:p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Help Center ❓
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* FAQ Item */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How does booking work?</h3>
          <p className="text-gray-600 mt-2">
            You select your vehicle and service, provide details, and submit a booking.
            Service providers then send price quotes which you can choose from.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Is the shown price final?</h3>
          <p className="text-gray-600 mt-2">
            No. The price shown is only an estimate. Final price is decided by the
            service provider after reviewing your issue.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How do I choose a provider?</h3>
          <p className="text-gray-600 mt-2">
            Once providers send quotes, you can compare prices and select the provider
            you prefer.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How does payment work?</h3>
          <p className="text-gray-600 mt-2">
            Currently, payment is done after service completion. Cash payment is
            supported. Online payment will be added soon.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="font-semibold text-lg">How do I know the service is completed?</h3>
          <p className="text-gray-600 mt-2">
            After service completion, you receive an OTP. Share this OTP with the
            service provider to confirm job completion.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            ⚠ For urgent issues, please contact your assigned service provider directly.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HelpCenterCustomer;

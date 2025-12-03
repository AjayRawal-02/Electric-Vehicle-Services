import React from "react";

const BookingStep4 = ({ bookingData, setStep, handleConfirmBooking }) => {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold text-center mb-6">
        Confirm Booking
      </div>

      {/* Booking Summary */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <div className="font-semibold text-lg mb-4">Booking Summary</div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Service:</span>
            <span>{bookingData.service}</span>
          </div>

          <div className="flex justify-between">
            <span>Vehicle:</span>
            <span>{bookingData.vehicle}</span>
          </div>

          <div className="flex justify-between">
            <span>Model:</span>
            <span>{bookingData.model}</span>
          </div>

          <div className="flex justify-between">
            <span>Address:</span>
            <span>{bookingData.address}</span>
          </div>

          <div className="flex justify-between">
            <span>Preferred Time:</span>
            <span>{bookingData.preferredTime}</span>
          </div>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        {/* No total price anymore — replaced with quote info */}
        <p className="text-center text-gray-600 text-sm">
          You will receive price quotes from service providers soon.
        </p>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <div className="flex items-start">
          <span className="text-yellow-500 mr-2 text-xl">⚠</span>
          <div className="text-sm space-y-2">
            <p>This booking does not include a final price right now.</p>
            <p>Service providers will review your request and send <b>price quotes</b>.</p>
            <p>You can <b>accept or reject quotes</b> — work will start only after you accept a quote.</p>
            <p>Payment is made after service completion.</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6 flex-wrap">
        <button
          className="border border-gray-500 py-1 px-3 rounded-lg shadow-sm 
                     sm:w-auto w-full mb-2 sm:mb-0"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
        >
          <i className="fa-solid fa-arrow-left"></i> Previous
        </button>

        <button
          className="border border-gray-500 py-1 px-3 rounded-lg shadow-sm bg-blue-700 text-white 
                     sm:w-auto w-full"
          onClick={handleConfirmBooking}
        >
          <i className="fa-solid fa-check mr-2"></i> Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingStep4;

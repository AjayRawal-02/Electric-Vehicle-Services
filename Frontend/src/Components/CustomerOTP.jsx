import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const CustomerOTP = () => {
  const { bookingId } = useParams();
  const [otp, setOtp] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    fetchOTP();
  }, []);

  const fetchOTP = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://electric-vehicle-services.onrender.com/api/bookings/otp/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (res.ok && data.otp) {
      setOtp(data.otp);
      setExpiresAt(data.expiresAt);
    } else {
      setOtp(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fcf4] px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔐 Service Verification
        </h2>

        <p className="text-gray-600 mb-6">
          Share this OTP with the service provider to complete the job
        </p>

        {otp ? (
          <>
            <div className="flex justify-center gap-3 mb-4">
              {otp.split("").map((digit, i) => (
                <div
                  key={i}
                  className="w-12 h-14 flex items-center justify-center text-2xl font-bold bg-green-100 border border-green-500 rounded"
                >
                  {digit}
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              ⏳ Valid till: {new Date(expiresAt).toLocaleTimeString()}
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            OTP will appear once provider requests completion
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerOTP;

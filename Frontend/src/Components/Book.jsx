import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { vehicleList } from '../assets/vehicleList';
import { serviceList } from '../assets/ServiceList';
import BookingStep4 from './BookingStep4';

const Book = () => {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");     // dropdown value
  const [customModel, setCustomModel] = useState("");       // manual entry when "other"

  const [location, setLocation] = useState("");
  const [currentCoords, setCurrentCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setCurrentCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setAddress(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
      },
      () => toast.error("Unable to retrieve your location")
    );
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login first.");

      // If other model selected → use custom model
      const finalModel = vehicleModel === "other" ? customModel : vehicleModel;

      const response = await fetch("https://electric-vehicle-services.onrender.com/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service: selectedService,
          vehicle: selectedVehicle,
          model: finalModel,
          address,
          preferredTime,
          additionalDetails,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Booking Confirmed Successfully!");
        setStep(1);
        setSelectedVehicle("");
        setSelectedService("");
        setFullName("");
        setPhone("");
        setVehicleModel("");
        setCustomModel("");
        setLocation("");
        setAddress("");
        setPreferredTime("");
        setAdditionalDetails("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-[#effaf7]">
      <Toaster />
      
      {/* Progress Indicator */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center gap-0 py-10 px-4 sm:px-10 md:px-20 lg:px-40 min-w-[400px]">
          {["Vehicle", "Service", "Details", "Confirm"].map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                      index + 1 <= step ? "bg-[#108fee]" : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm mt-2 text-center">{label}</p>
                </div>
                {index < 3 && (
                  <div
                    className={`h-[3px] w-[80px] ml-2 mb-6 mr-2 ${
                      index + 2 <= step ? "bg-[#108fee]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] m-auto rounded-xl shadow-sm p-10">

        {/* Step 1 — Vehicle */}
        {step === 1 && (
          <>
            <div className="text-2xl md:text-3xl font-bold text-center p-2">Select Your Vehicle</div>
            {vehicleList.map((vehicle, i) => (
              <div
                key={i}
                onClick={() => { setSelectedVehicle(vehicle.title); setVehicleModel(""); setCustomModel(""); }}
                className={`border-2 flex flex-col sm:flex-row items-center p-6 my-4 rounded-lg cursor-pointer ${
                  selectedVehicle === vehicle.title ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <div className="w-20 h-20 bg-[#dbeafe] rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4 sm:mb-0 sm:mr-6">
                  <i className={`fa-solid ${vehicle.icon}`}></i>
                </div>
                <div className="flex-1 w-full">
                  <div className="font-bold text-xl md:text-2xl mb-4 text-center sm:text-left">
                    {vehicle.title}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Step 2 — Service */}
        {step === 2 && (
          <>
            <div className="text-2xl md:text-3xl font-bold text-center p-2">Choose Your Service</div>
            {serviceList.map((service, i) => (
              <div
                key={i}
                onClick={() => setSelectedService(service.title)}
                className={`border-2 flex flex-col sm:flex-row items-center p-6 my-4 rounded-lg cursor-pointer ${
                  selectedService === service.title ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <div className="w-20 h-20 bg-[#dbeafe] rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4 sm:mb-0 sm:mr-6">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <div className="flex-1 w-full">
                  <div className="font-bold text-xl md:text-2xl text-center sm:text-left">
                    {service.title}
                  </div>
                  <div className="text-gray-600 mb-4 text-center sm:text-left">
                    {service.description}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-2xl md:text-3xl font-bold text-center">Booking Details</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="border p-3 rounded-md w-full" />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="border p-3 rounded-md w-full" />
            </div>

            {/* Dynamic Vehicle Model */}
            <select
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="border p-3 rounded-md w-full"
            >
              <option value="">Select Vehicle Model</option>
              {selectedVehicle &&
                vehicleList.find(v => v.title === selectedVehicle)?.models.map((model, idx) => (
                  <option key={idx} value={model}>{model}</option>
                ))}
              <option value="other">Other (Enter manually)</option>
            </select>

            {vehicleModel === "other" && (
              <input
                type="text"
                placeholder="Enter your vehicle model"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                className="border p-3 rounded-md w-full mt-3"
              />
            )}

            {/* Location */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="Search location" value={location} onChange={e => setLocation(e.target.value)} className="border p-3 rounded-md flex-1" />
                <button onClick={getCurrentLocation} className="bg-blue-500 text-white px-4 rounded-md">Use This</button>
              </div>
              {currentCoords && (
                <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-md">
                  Selected Location: {currentCoords.lat}, {currentCoords.lng}
                </div>
              )}
            </div>

            <input type="text" placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-3 rounded-md w-full" />
            <input type="datetime-local" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="border p-3 rounded-md w-full" />
            <textarea placeholder="Describe problem or additional requirements..." value={additionalDetails} onChange={e => setAdditionalDetails(e.target.value)} className="border p-3 rounded-md w-full min-h-[100px]"></textarea>
          </div>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <BookingStep4
            bookingData={{
              service: selectedService,
              vehicle: selectedVehicle,
              model: vehicleModel === "other" ? customModel : vehicleModel,
              address,
              preferredTime,
            }}
            setStep={setStep}
            handleConfirmBooking={handleConfirmBooking}
          />
        )}

        {/* Navigation Buttons */}
        {step !== 4 && (
          <div className="flex justify-between mt-6">
            <button className="border border-gray-500 py-1 px-3 rounded-lg shadow-sm" onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1}>
              <i className="fa-solid fa-arrow-left"></i> Previous
            </button>
            <button
              className="border border-gray-500 py-1 px-3 rounded-lg shadow-sm bg-blue-400 text-white"
              onClick={() => {
                if (step === 1 && !selectedVehicle) return toast.info("Select a vehicle");
                if (step === 2 && !selectedService) return toast.info("Select a service");
                if (step === 3 && (!fullName || !phone || !vehicleModel || !address))
                  return toast.info("Fill all required fields");
                setStep(p => Math.min(4, p + 1));
              }}
            >
              Next <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;

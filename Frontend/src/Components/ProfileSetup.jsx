import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    address: "",
    vehicleType: "",
    companyName: "",
    licenseNumber: "",
    serviceTypes: [],
  });

  useEffect(() => {
    if (!user || !token) navigate("/login"); // protect route
  }, [navigate, user, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Submit profile data to backend
    const res = await fetch(`https://electric-vehicle-services.onrender.com/api/users/${user.id}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, userType: user.userType }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Profile updated successfully!");
      navigate("/dashboard"); // redirect to dashboard
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {user.userType === "Service Seeker" && (
          <>
            <input
              type="text"
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="vehicleType"
              placeholder="Vehicle Type"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        {user.userType === "Service Provider" && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="serviceTypes"
              placeholder="Service Types (comma separated)"
              value={formData.serviceTypes}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import user_img from "../assets/Download.png";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


const Profile_ServiceProvider = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    serviceType: "",
    experience: "",
    workingArea: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);
const { setUser } = useContext(AuthContext);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://electric-vehicle-services.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      setProfile({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        photo: data.photo || "",
        serviceType: data.serviceType || "",
        experience: data.experience || "",
        workingArea: data.workingArea || "",
      });
    } catch {
      toast.error("Failed to fetch profile");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  Object.entries(profile).forEach(([key, value]) => {
    if (key !== "photo") formData.append(key, value);
  });
  if (imageFile) formData.append("photo", imageFile);

  try {
    const res = await fetch("http://localhost:5000/api/provider/update-profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Profile updated successfully!");

    // 🔥 Update global Auth state + localStorage
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    setIsEditing(false);
    setPreviewImg(null);
    fetchProfile();
  } catch {
    toast.error("Update failed");
  }
};


  if (loading)
    return <div className="text-center p-10 text-xl">Loading...</div>;

  return (
    <div className="bg-[#f0fcf4] min-h-screen p-6 sm:p-10 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Service Provider Profile
        </h1>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            {/* show uploaded or preview image */}
    {previewImg || profile.photo ? (
      <img
        src={previewImg || profile.photo}
        alt="profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
      />
    ) : (
      /* Camera icon when no photo */
      <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center">
        <i className="fa-solid fa-camera text-gray-600 text-3xl"></i>
      </div>
    )}

           {isEditing && (
      <label className="absolute bottom-1 right-1 bg-blue-600 shadow-md text-white px-2 py-1 text-xs rounded cursor-pointer hover:bg-blue-700">
        Upload
        <input type="file" accept="image/*" hidden onChange={handleImageSelect} />
      </label>
    )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <InputField label="Name" disabled={!isEditing} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <InputField label="Email" disabled value={profile.email} />
          <InputField label="Phone" disabled={!isEditing} value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          <InputField label="Address" type="textarea" disabled={!isEditing} value={profile.address} onChange={(v) => setProfile({ ...profile, address: v })} />
          <InputField label="Service Type" disabled={!isEditing} value={profile.serviceType} onChange={(v) => setProfile({ ...profile, serviceType: v })} />
          <InputField label="Experience (Years)" disabled={!isEditing} value={profile.experience} onChange={(v) => setProfile({ ...profile, experience: v })} />
          <InputField label="Working Area" disabled={!isEditing} value={profile.workingArea} onChange={(v) => setProfile({ ...profile, workingArea: v })} />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-7">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleUpdate} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImg(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const InputField = ({ label, value, onChange, disabled, type }) => (
  <div>
    <label className="text-gray-600 font-medium">{label}</label>
    {type === "textarea" ? (
      <textarea
        disabled={disabled}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full p-3 border rounded-md disabled:bg-gray-100"
        rows="3"
      ></textarea>
    ) : (
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full p-3 border rounded-md disabled:bg-gray-100"
      />
    )}
  </div>
);

export default Profile_ServiceProvider;

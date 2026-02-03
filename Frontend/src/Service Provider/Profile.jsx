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
    const res = await fetch("https://electric-vehicle-services.onrender.com/api/provider/update-profile", {
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
  <div className="min-h-screen bg-gradient-to-br from-[#eef7f3] to-[#f9fbff] p-4 sm:p-10 flex justify-center">
    <div className="w-full max-w-4xl">
      
      {/* PROFILE HERO */}
      <div className="relative mb-12 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

        <div className="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-center gap-6 text-white">
          
          {/* Avatar */}
          <div className="relative">
            {previewImg || profile.photo ? (
              <img
                src={previewImg || profile.photo}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center text-4xl">
                👤
              </div>
            )}

            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-black/60 text-white px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-black">
                Change
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {profile.name || "Service Provider"}
            </h1>
            <p className="opacity-90 mt-1">{profile.email}</p>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm">
              🛠️ {profile.serviceType || "Service Type"}
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE FORM */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profile Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <InputField label="Name" disabled={!isEditing} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <InputField label="Email" disabled value={profile.email} />
          <InputField label="Phone" disabled={!isEditing} value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          <InputField label="Service Type" disabled={!isEditing} value={profile.serviceType} onChange={(v) => setProfile({ ...profile, serviceType: v })} />
          <InputField label="Experience (Years)" disabled={!isEditing} value={profile.experience} onChange={(v) => setProfile({ ...profile, experience: v })} />
          <InputField label="Working Area" disabled={!isEditing} value={profile.workingArea} onChange={(v) => setProfile({ ...profile, workingArea: v })} />
          <div className="sm:col-span-2">
            <InputField label="Address" type="textarea" disabled={!isEditing} value={profile.address} onChange={(v) => setProfile({ ...profile, address: v })} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4 mt-10">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-8 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImg(null);
                }}
                className="px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

// Reusable input component
const InputField = ({ label, value, onChange, disabled, type }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-1 block">
      {label}
    </label>

    {type === "textarea" ? (
      <textarea
        disabled={disabled}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows="3"
        className="
          w-full rounded-xl border px-4 py-3
          focus:ring-2 focus:ring-green-400 focus:outline-none
          disabled:bg-gray-100 disabled:text-gray-500
        "
      />
    ) : (
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="
          w-full rounded-xl border px-4 py-3
          focus:ring-2 focus:ring-green-400 focus:outline-none
          disabled:bg-gray-100 disabled:text-gray-500
        "
      />
    )}
  </div>
);


export default Profile_ServiceProvider;

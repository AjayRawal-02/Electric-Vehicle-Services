import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { user, setUser } = useContext(AuthContext);

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
    setPreviewImg(URL.createObjectURL(file)); // preview
  };

  const handleUpdate = async () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("name", profile.name);
  formData.append("phone", profile.phone);
  formData.append("address", profile.address);
  if (imageFile) formData.append("photo", imageFile);

  try {
    const res = await fetch("https://electric-vehicle-services.onrender.com/api/auth/update-profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Profile updated successfully!");

    // 🔥 Update global Auth context + localStorage
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    setIsEditing(false);
    setImageFile(null);
    fetchProfile();
  } catch {
    toast.error("Update failed");
  }
};


  if (loading) return <div className="text-center p-10 text-xl">Loading...</div>;

  return (
    <div className="bg-[#f0fcf4] min-h-screen p-6 sm:p-10 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          My Profile
        </h1>

        {/* Profile Image Section */}
        {/* Profile Image Section */}
<div className="flex justify-center mb-6 relative">
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

    {/* Upload button visible only in edit mode */}
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
          <div>
            <label className="text-gray-600 font-medium">Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border rounded-md disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full p-3 border rounded-md bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium">Phone</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-3 border rounded-md disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium">Address</label>
            <textarea
              disabled={!isEditing}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-3 border rounded-md disabled:bg-gray-100"
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-7">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
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

export default Profile;

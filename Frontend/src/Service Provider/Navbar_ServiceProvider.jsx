import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import user_img from "../assets/download.png";
import logo from '../assets/logo1.png';
import { toast } from 'react-hot-toast';
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


const Navbar_ServiceProvider = () => {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();
const [notifCount, setNotifCount] = useState(0);

const fetchNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("http://localhost:5000/api/auth/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  setNotifCount(Array.isArray(data.notifications) ? data.notifications.length : 0);
};



  // const { user, setUser } = useContext(AuthContext); // 🔥 live user state

  const handleProtectedClick = (path) => {
    if (!user) {
      toast.warning("Please login first!");
      navigate("/login");
      return;
    }
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // 🔥 live logout update
    toast.success("Logged out successfully!");
    navigate("/");
    setMenuOpen(false);
    setProfileDropdown(false);
  };


  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-300 relative">

      {/* Logo */}
      <Link to="/" className="ml-4 sm:ml-6">
        <img src={logo} alt="Company Logo" className="h-8 sm:h-9 lg:h-10 w-auto object-contain" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 mr-8">
        <ul className="flex gap-6 items-center">
          <li><button onClick={() => handleProtectedClick("/")}>Home</button></li>
          <li><button onClick={() => handleProtectedClick("/service-requests")}>Service Requests</button></li>
          <li><button onClick={() => handleProtectedClick("/earnings")}>My Earnings</button></li>
          <li><button onClick={() => handleProtectedClick("/support")}>Support</button></li>

          <li className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
  <i className="fa-regular fa-bell bg-gray-100 p-2 rounded"></i>
  
  {notifCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
      {notifCount}
    </span>
  )}
</li>



          {/* 🔥 Conditional Login / Profile */}
          {user ? (
            <li className="relative">
              <img
                src={user?.photo || user_img}
                alt="user"
                className="h-[34px] border border-gray-400 rounded-full p-[2px] cursor-pointer"
                onClick={() => setProfileDropdown(!profileDropdown)}
              />

              {profileDropdown && (
                <div className="absolute right-0 top-[42px] bg-white shadow-lg rounded-md w-44 py-2 z-20">
                  <p className="px-4 py-2 font-semibold text-gray-700">{user?.name}</p>
                  <p className="px-4 text-xs text-green-600">Service Provider</p>
                  <hr />
                  <button onClick={() => navigate("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Profile</button>
                  <button onClick={() => navigate("/service-requests")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Service Requests</button>
                  <button onClick={() => navigate("/earnings")} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">My Earnings</button>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="p-2 border border-blue-800 text-blue-800 rounded text-sm hover:bg-blue-800 hover:text-white transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile menu (unchanged except login fix) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-md z-10">
          <ul className="flex flex-col p-4 gap-4 text-gray-800">
            {user ? (
              <img src={user?.photo || user_img} className="h-[34px] border rounded-full cursor-pointer" />
            ) : (
              <Link to="/login" className="hover:text-blue-700" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
            <li><button onClick={() => handleProtectedClick("/service-requests")}>Service Requests</button></li>
            <li><button onClick={() => handleProtectedClick("/earnings")}>My Earnings</button></li>
            <li><button onClick={() => handleProtectedClick("/support")}>Support</button></li>
            {user && <li onClick={handleLogout} className="hover:text-red-600 cursor-pointer">Logout</li>}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Navbar_ServiceProvider;

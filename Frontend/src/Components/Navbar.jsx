import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import user_img from '../assets/download.png';
import logo from '../assets/logo1.png';
import { toast } from 'react-hot-toast';
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notifyDropdown, setNotifyDropdown] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext); // 🔥 LIVE authentication state
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getNotifications = () => {
      fetch("https://electric-vehicle-services.onrender.com/api/auth/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setNotifications(Array.isArray(data) ? data : []);

        })
        .catch(() => setNotifications([]));
    };

    getNotifications();                         // get immediately
    const interval = setInterval(getNotifications, 5000); // repeat every 5 sec

    return () => clearInterval(interval);
  }, []);



  const handleProtectedClick = (path) => {
    if (!user) {
      toast.warning("Please login first!");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // 🔥 logout reacts instantly
    toast.success("Logged out successfully!");
    navigate("/");
    setProfileDropdown(false);
    setMenuOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-300 relative">

      {/* Logo */}
      <Link to="/" className="ml-4 sm:ml-6 flex items-center">
        <img src={logo} alt="Company Logo" className="h-8 sm:h-9 lg:h-10 w-auto object-contain" />
      </Link>

      {/* Small Screen Buttons */}
      <div className="flex items-center gap-4 md:hidden mr-4">
        <button
          onClick={() => handleProtectedClick("/book")}
          className="p-2 bg-blue-800 text-white rounded text-sm"
        >
          Book Now
        </button>
        <div
            className="relative cursor-pointer"
            onClick={() => {
              setNotifyDropdown(!notifyDropdown);
              setProfileDropdown(false);

              // Mark notifications as read when dropdown opens
              if (!notifyDropdown) {
                const token = localStorage.getItem("token");
                fetch("https://electric-vehicle-services.onrender.com/api/auth/notifications/read", {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` }
                }).then(() => {
                  setNotifications([]);       // clear badge instantly
                });
              }
            }}

          >
            <i className="fa-regular fa-bell bg-gray-100 p-2 rounded"></i>

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}

            {/* 🔥 Notification Dropdown */}
            {notifyDropdown && (
              <div className="absolute right-0 top-9 w-72 bg-white shadow-lg rounded-md p-2 z-50">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-2">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-2 border-b last:border-none">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <small className="text-xs text-gray-500 block">
                        {new Date(n.time).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 mr-8">
        <ul className="flex gap-6 items-center">
          <li className="hover:text-blue-700"><Link to="/">Home</Link></li>
          <li className="hover:text-blue-700"><a href="#services">Services</a></li>
          <li className="hover:text-blue-700">
            <button onClick={() => handleProtectedClick("/my-bookings")}>My Bookings</button>
          </li>
          <li className="hover:text-blue-700">
            <button onClick={() => handleProtectedClick("/support")}>Support</button>
          </li>

          <li>
            <button
              onClick={() => handleProtectedClick("/book")}
              className="p-2 bg-blue-800 text-white rounded text-sm"
            >
              Book Now
            </button>
          </li>

          <div
            className="relative cursor-pointer"
            onClick={() => {
              setNotifyDropdown(!notifyDropdown);
              setProfileDropdown(false);

              // Mark notifications as read when dropdown opens
              if (!notifyDropdown) {
                const token = localStorage.getItem("token");
                fetch("https://electric-vehicle-services.onrender.com/api/auth/notifications/read", {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` }
                }).then(() => {
                  setNotifications([]);       // clear badge instantly
                });
              }
            }}

          >
            <i className="fa-regular fa-bell bg-gray-100 p-2 rounded"></i>

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}

            {/* 🔥 Notification Dropdown */}
            {notifyDropdown && (
              <div className="absolute right-0 top-9 w-72 bg-white shadow-lg rounded-md p-2 z-50">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-2">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-2 border-b last:border-none">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <small className="text-xs text-gray-500 block">
                        {new Date(n.time).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>



          {/* Profile / Login */}
          {user ? (
            <li className="relative">
              <img
                src={user?.photo || user_img}
                alt="user"
                className="h-[34px] border border-gray-400 rounded-full p-[2px] cursor-pointer"
                onClick={() => { setProfileDropdown(!profileDropdown); setNotifyDropdown(false); }}
              />

              {profileDropdown && (
                <div className="absolute right-0 top-[42px] bg-white shadow-lg rounded-md w-40 py-2 z-20">
                  <p className="px-4 pt-2 pb-1 text-gray-700 font-semibold">{user?.name}</p>
                  <p className="px-4 text-xs text-gray-500">Customer</p>
                  <hr />
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => { navigate("/profile"); setProfileDropdown(!profileDropdown) }}>Profile</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => { navigate("/my-bookings"); setProfileDropdown(!profileDropdown) }}>My Bookings</button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    onClick={handleLogout}>Logout</button>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-md z-10">
          <ul className="flex flex-col p-4 gap-4 text-gray-800">
            {user && (
              <li className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <img src={user?.photo || user_img} className="h-10 w-10 border rounded-full p-[2px]" />
                <div>
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
              </li>
            )}

            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><a href="#services">Services</a></li>
            <li><button onClick={() => handleProtectedClick("/my-bookings")}>My Bookings</button></li>
            <li><button onClick={() => handleProtectedClick("/support")}>Support</button></li>

            {user && (
              <li onClick={handleLogout} className="hover:text-red-600 cursor-pointer">Logout</li>
            )}
            {!user && (
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;

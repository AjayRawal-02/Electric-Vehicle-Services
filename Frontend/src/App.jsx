import React, { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Navbar_ServiceProvider from './Service Provider/Navbar_ServiceProvider';
import {Toaster} from "react-hot-toast"
import Header from './Components/Header';
import Data from './Components/Data';
import Features from './Components/Features';
import Services from './Components/Services';
import Steps from './Components/Steps';
import Footer from './Components/Footer';
import Book from './Components/Book';
import ServiceForm from './Components/ServiceForm';
import Login from './Components/Login';
import Dashboard from './Components/CustomerDashboard';
import ForgotPassword from './Components/ForgetPassword';
import ProfileSetup from './Components/ProfileSetup';
import Home_ServiceProvider from './Service Provider/Home_ServiceProvider';
import { AuthContext } from "./Context/AuthContext";
import Earnings from './Service Provider/Earnings';
import ServiceRequests from './Service Provider/ServiceRequests';
import MyBookings from './Components/MyBookings';
import Profile from './Components/Profile';
import Profile_ServiceProvider from './Service Provider/Profile';
import CustomerQuotes from "../src/Components/CustomerQuotes";
import Notifications from './Service Provider/Notifications';
import TrackOrder from "../src/Components/TrackOrder";
import TrackOrderPage from './Components/TrackOrderPage';
import HelpCenterCustomer from './Components/HelpCenterCustomer';
import HelpCenterProvider from './Service Provider/HelpCenterProvider';
import CustomerOTP from './Components/CustomerOTP';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Pages where navbar should NOT appear
  const hideNavbarRoutes = ["/login", "/signup", "/profile-setup", "/forgot-password"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());

  return (
    <div>
      {/* Show navbar only when page is NOT login/signup */}
      {!shouldHideNavbar && (
        user && user.usertype === "Service Provider" ? (
          <Navbar_ServiceProvider />
        ) : (
          <Navbar />
        )
      )}

      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            user && user.usertype === "Service Provider" ? (
              <Home_ServiceProvider />
            ) : (
              <>
                <Header />
                <Data />
                <Services />
                <Features />
                <Steps />
                <Footer />
              </>
            )
          }
        />

        <Route
          path="/profile"
          element={
            user && user.usertype === "Service Provider" ? (
              <>
              <Profile_ServiceProvider/>
              </>
              
            ) : (
              <>
                <Profile/>
              </>
            )
          }
        />
        <Route path='/help' element={<HelpCenterCustomer/>}/>
        <Route path='/service-provider/help' element={<HelpCenterProvider/>}/>
        {/* Booking */}
        <Route path="book" element={<Book />} />

        {/* Customer Form */}
        <Route path="Services" element={<ServiceForm />} />

        {/* Auth Pages */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<ProfileSetup />} /> {/* If signup page exists */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* Dashboards */}
        <Route path="/Customer-Dashboard" element={<Dashboard />} />
        <Route path="/Service-Provider-Dashboard" element={<Home_ServiceProvider />} />
         <Route path="/quotes/:bookingId" element={<CustomerQuotes />} />
        <Route path='/earnings' element={<Earnings/>} />
        <Route path='/service-requests' element={<ServiceRequests/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/notifications" element={<Notifications />} />
        {/* <Route path="/track/:bookingId" element={<TrackOrder />} /> */}
        <Route path="/track/:bookingId" element={<TrackOrderPage />} />

        <Route
  path="/verify-service/:bookingId"
  element={<CustomerOTP />}
/>
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;

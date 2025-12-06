import React, { useState } from 'react'
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


const Login = () => {

    const [Login, setLogin] = useState(1);
  const [ViewPassword, setViewPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://electric-vehicle-services.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid credentials");
      } else {
        toast.success(data.message || "Login successful!");
        console.log(data.token)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



    return (
        <div className='sm:flex bg-[#f0fcf4] flex-col sm:flex-row items-center'>
            <div className='sm:w-[50%] p-8'>
                <div className='my-2 inline-flex items-center justify-center rounded-md border font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-primary [a&]:hover:bg-primary/90 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 text-lg shadow-lg'>Rajasthan's #1 EV Service</div>
                <div className='text-4xl lg:text-6xl font-bold text-gray-900 leading-tight my-4'><h1 className='text-[#111826]'>Welcome to Your <span className='bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent'>EV BUDDY</span></h1></div>
                <div className='text-xl text-gray-600 leading-relaxed my-4'><p>Join thousands of EV owners in Jaipur who trust us for 24/7 emergency charging, maintenance, and care with authentic Rajasthani hospitality! 🚗⚡</p></div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-6 w-6 text-blue-600"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg></div>
                        <div><div className="font-semibold text-gray-900">24/7 Service</div>
                            <div className="text-sm text-gray-600">Always Available</div></div></div>
                    <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-6 w-6 text-green-600"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg></div>
                        <div><div className="font-semibold text-gray-900">Certified Buddies</div><div className="text-sm text-gray-600">Expert Technicians</div></div></div>
                    <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star h-6 w-6 text-purple-600"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></div>
                        <div><div className="font-semibold text-gray-900">4.8★ Rating</div><div className="text-sm text-gray-600">Customer Love</div></div></div><div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-6 w-6 text-orange-600"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></div><div><div className="font-semibold text-gray-900">2500+ Bookings</div><div className="text-sm text-gray-600">Trusted Service</div></div></div></div>
            </div>
            {Login === 1 && (<div className='sm:w-[50%] bg-white my-4 sm:my-4 mx-4 sm:mx-[100px] p-4 rounded-md'>
                <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.4 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 text-center space-y-4">
                    <h2 className='font-bold text-3xl text-[rgb(17 24 38 / var(--tw-text-opacity, 1))]'>Login</h2>
                    <p className="text-gray-600">Sign in to access your EV buddy dashboard</p>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label
                                data-slot="label"
                                className="flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                >
                                    <rect width={20} height={16} x={2} y={4} rx={2} />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <input
                                    type="email"
                                    data-slot="input"
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    id="email"
                                    placeholder="Enter your email"
                                    required=""
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                data-slot="label"
                                className="flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                >
                                    <rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    type={ViewPassword ? "text" : "password"}
                                    data-slot="input"
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    id="password"
                                    placeholder="Enter your password"
                                    required=""
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-eye h-5 w-5"
                                        onClick={() => setViewPassword(!ViewPassword)}
                                    >
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                        <circle cx={12} cy={12} r={3} />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">

                            <p className="mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Forgot password?
                                </Link>
                            </p>
                        </div>
                        <button
                            data-slot="button"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary hover:bg-primary/90 px-4 py-2 has-[>svg]:px-3 w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                            type="submit"
                        >
                            Sign In
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-arrow-right ml-2 h-5 w-5"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                    <>
                        <div className="relative">
                            <div
                                data-orientation="horizontal"
                                role="none"
                                data-slot="separator"
                                className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-white px-4 text-sm text-gray-500">or</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button
                                data-slot="button" onClick={() => handleGoogleSignIn(navigate)}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([className*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-4 py-2 has-[>svg]:px-3 w-full h-12 bg-white border-2 border-gray-200 hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{/* */}{" "}
                                <button className="text-blue-600 hover:text-blue-800 font-semibold" onClick={() => setLogin(2)}>
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </>

                </div>
            </div>)}
            {Login === 2 && (<Signup setLogin={setLogin} />)}
        </div>
    )
}

export default Login
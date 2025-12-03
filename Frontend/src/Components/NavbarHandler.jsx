// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar"; // Customer Navbar
// import Navbar_ServiceProvider from "../Service Provider/Navbar_ServiceProvider"; // Provider Navbar

// const NavbarHandler = () => {
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       setRole("guest");
//       return;
//     }

//     const parsedUser = JSON.parse(user);
//     setRole(parsedUser.usertype);
//   }, []);

//   return (
//     <>
//       {role === "Service Provider" ? (
//         <Navbar_ServiceProvider />
//       ) : (
//         <Navbar /> // Customer / Guest Navbar
//       )}
//     </>
//   );
// };

// export default NavbarHandler;

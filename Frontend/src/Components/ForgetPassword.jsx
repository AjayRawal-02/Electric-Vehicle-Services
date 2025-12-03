import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      // Friendly error messages
      switch (err.code) {
        case "auth/invalid-email":
          toast.error("The email address is not valid.");
          break;
        case "auth/user-not-found":
          toast.error("No account found with this email.");
          break;
        default:
          toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Send Reset Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

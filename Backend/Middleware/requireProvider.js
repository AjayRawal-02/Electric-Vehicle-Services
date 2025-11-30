// Middleware/requireProvider.js
import User from "../Models/User.js";

const requireProvider = async (req, res, next) => {
  try {
    // req.user must be set by authMiddleware (id)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.usertype !== "Service Provider") {
      return res.status(403).json({ message: "Forbidden: provider access only" });
    }

    req.currentUser = user; // attach full user if needed
    next();
  } catch (err) {
    console.error("requireProvider error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default requireProvider;

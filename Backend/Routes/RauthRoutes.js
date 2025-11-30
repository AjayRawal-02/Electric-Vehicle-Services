// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../Models/User.js";
// import authMiddleware from "../Middleware/authMiddleware.js";
// // import your auth middleware

// const router = express.Router();

// // ------------------ SIGNUP ------------------
// router.post("/signup", async (req, res) => {
//   try {
//     console.log("REQ BODY:", req.body);
//     const { name, usertype, email, phone, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already registered" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       usertype,
//       email,
//       phone,
//       password: hashedPassword,
//     });

//     // Create JWT token
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     // Return user without password
//     const { password: pwd, ...userWithoutPassword } = newUser.toObject();

//     res.status(201).json({ user: userWithoutPassword, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------ LOGIN ------------------
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     const { password: pwd, ...userWithoutPassword } = user.toObject();

//     res.json({ user: userWithoutPassword, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ------------------ GET PROFILE ------------------
// router.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     console.log(user)
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// import multer from "multer";
// const upload = multer({ storage: multer.memoryStorage() });

// router.put("/update-profile", authMiddleware, upload.single("photo"), async (req, res) => {
//   try {
//     const { name, phone, address } = req.body;

//     // Fields that will be updated
//     const updateData = { name, phone, address };

//     // If user uploaded a picture, convert to base64 and store
//     if (req.file) {
//       const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       updateData.photo = base64Image;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       updateData,
//       { new: true }
//     ).select("-password");

//     res.json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// });


// export default router;


import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// ---- Multer Setup (for profile picture upload) ----
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, usertype, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      usertype,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pwd, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------ GET PROFILE ------------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------ UPDATE PROFILE ------------------
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const updateData = { name, phone, address };

      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        updateData.photo = base64Image;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
);

router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notifications");
    res.json(user.notifications || []);
 // <-- wrapped inside object
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.delete("/notifications/clear", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { notifications: [] });
    res.json({ message: "Notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
});

router.put("/notifications/read", authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $set: { "notifications.$[].read": true }
  });
  res.json({ message: "Notifications marked read" });
});

export default router;

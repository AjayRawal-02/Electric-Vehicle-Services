import express from "express";
import Booking from "../Models/Booking.js";
import User from "../Models/User.js";                // ⬅ REQUIRED
import authMiddleware from "../Middleware/authMiddleware.js";
import requireProvider from "../Middleware/requireProvider.js";
import upload from "../Middleware/upload.js";        // ⬅ REQUIRED
import { calculateDistance } from "../utils/calcDistance.js"
import mongoose from "mongoose";


const router = express.Router();

// ------------------ UPDATE PROFILE ------------------
router.put(
  "/update-profile",
  authMiddleware,
  requireProvider,
  upload.single("photo"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        serviceType: req.body.serviceType,
        experience: req.body.experience,
        workingArea: req.body.workingArea,
      };

      if (req.file) {
        updateData.photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      return res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
  }
);

// ------------------ OTHER ROUTES ------------------

// 1. Get pending bookings
router.get("/bookings/pending", authMiddleware, requireProvider, async (req, res) => {
  try {
    const provider = await User.findById(req.user.id);
    const providerLat = provider.workingArea.latitude;
    const providerLon = provider.workingArea.longitude;

    const pending = await Booking.find({ status: "pending" }).populate("customer", "name phone");

    const result = pending.map((booking) => {
      const distance = calculateDistance(
        providerLat,
        providerLon,
        booking.location.latitude,
        booking.location.longitude
      );

      return {
        ...booking._doc,
        distance,
        price: booking.totalPrice,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// 2. Accept a booking
router.post("/bookings/:id/accept", authMiddleware, requireProvider, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending") return res.status(400).json({ message: "Not pending" });

    booking.status = "accepted";
    booking.assignedProvider = req.user.id;
    booking.providerResponseAt = new Date();
    await booking.save();

    res.json({ message: "Booking accepted", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error accepting booking" });
  }
});

// 3. Reject
router.post("/bookings/:id/reject", authMiddleware, requireProvider, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "pending") return res.status(400).json({ message: "Not pending" });

    booking.status = "rejected";
    booking.assignedProvider = req.user.id;
    booking.providerResponseAt = new Date();
    await booking.save();

    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error rejecting booking" });
  }
});

// 4. Complete booking
router.post("/bookings/:id/complete", authMiddleware, requireProvider, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.assignedProvider.toString() !== req.user.id)
      return res.status(403).json({ message: "Only assigned provider can complete" });

    booking.status = "completed";
    await booking.save();
    res.json({ message: "Booking completed", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error completing booking" });
  }
});

// 5. Get accepted bookings
router.get("/bookings/accepted", authMiddleware, requireProvider, async (req, res) => {
  try {
    const accepted = await Booking.find({
      status: "accepted",
      assignedProvider: req.user.id,
    }).populate("customer");
    res.json(accepted.map(b => ({
  ...b._doc,
  price: b.totalPrice
})));
  } catch (err) {
    res.status(500).json({ message: "Server error fetching accepted bookings" });
  }
});
// 💰 Provider submits price quote
router.post("/bookings/:id/quote", authMiddleware, requireProvider, async (req, res) => {
  try {
    const { price } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId).populate("customer");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Add quote
    booking.quotes.push({
      provider: req.user.id,
      price,
      time: new Date()
    });
    booking.status = "quoted"; // Booking waiting for customer decision
    await booking.save();

    // 🔔 Create notification for customer
    await User.findByIdAndUpdate(
      booking.customer._id,
      {
        $push: {
          notifications: {
            message: `New price quote received for ${booking.service}: ₹${price}`,
            time: new Date(),
            read: false,
            bookingId: booking._id,
          }
        }
      }
    );

    res.json({ message: "Quote sent", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending quote" });
  }
});

// 📌 Get all service history for provider
router.get("/service-history", authMiddleware, requireProvider, async (req, res) => {
  try {
    const history = await Booking.find({
      assignedProvider: req.user.id,          // this provider
      status: { $in: ["completed", "cancelled"] },  // only completed or cancelled
    })
      .populate("customer", "name")            // fetch customer name
      .sort({ updatedAt: -1 });                // latest first

    res.json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching service requests" });
  }
});

// 📌 Get Active Job for Provider
router.get("/active-job", authMiddleware, requireProvider, async (req, res) => {
  try {
    const job = await Booking.findOne({
      assignedProvider: req.user.id,
      status: {
        $in: ["accepted", "waiting_customer_verification"]
      }
    }).populate("customer", "name phone");

    res.json({ job });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching active job" });
  }
});



// 📌 Mark job completed
// router.put("/active-job/complete/:id", authMiddleware, requireProvider, async (req, res) => {
//   try {
//     const job = await Booking.findById(req.params.id);

//     if (!job) return res.status(404).json({ message: "Booking not found" });
//     if (job.assignedProvider.toString() !== req.user.id)
//       return res.status(403).json({ message: "Unauthorized" });

//     job.status = "completed";
//     await job.save();

//     res.json({ message: "Job completed successfully", job });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Failed to mark completed" });
//   }
// });

// ✅ STEP 1: Provider requests OTP (instead of completing directly)
router.put(
  "/active-job/request-otp/:bookingId",
  authMiddleware,
  requireProvider,
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);

      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      if (booking.assignedProvider.toString() !== req.user.id)
        return res.status(403).json({ message: "Unauthorized" });

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      booking.completionOTP = otp;
      booking.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      booking.status = "waiting_customer_verification";

      await booking.save();

      res.json({ message: "OTP generated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "OTP generation failed" });
    }
  }
);


router.get("/summary", authMiddleware, requireProvider, async (req, res) => {
  try {
    const providerId = req.user.id;

    const newRequests = await Booking.countDocuments({ status: "pending" });
    const activeJobs = await Booking.countDocuments({
      status: "accepted",
      assignedProvider: providerId,
    });
    const earningsToday = await Booking.aggregate([
      {
        $match: {
          assignedProvider: new mongoose.Types.ObjectId(providerId),
          status: "completed",
          updatedAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // from midnight
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } },
    ]);
    const ratings = 4.8; // Placeholder, if ratings feature not added

    res.json({
      newRequests,
      activeJobs,
      earningsToday: earningsToday[0]?.total || 0,
      rating: ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});


router.get("/earnings", authMiddleware, requireProvider, async (req, res) => {
  try {
    const providerId = req.user.id;

    // List of completed bookings
    const bookings = await Booking.find({
      assignedProvider: providerId,
      status: "completed",
    })
      .populate("customer", "name")
      .sort({ updatedAt: -1 }); // latest first

    // Format response for frontend
    const earnings = bookings.map((b) => ({
      id: b._id,
      date: new Date(b.updatedAt).toLocaleDateString(),
      service: b.service,
      amount: b.finalPrice || b.totalPrice || 0,
    }));

    // Total earnings
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalEarnings: total,
      earnings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

router.put("/update-location", authMiddleware, requireProvider, async (req, res) => {
  const { latitude, longitude } = req.body;

  const job = await Booking.findOne({
    assignedProvider: req.user.id,
    status: "active"
  });

  if (!job) return res.status(404).json({ message: "No active job found" });

  job.providerLocation = { latitude, longitude };
  await job.save();

  res.json({ message: "Location updated" });
});

router.put("/complete-job/:id", authMiddleware, requireProvider, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.status = "completed";
  await booking.save();

  // notify.customer
  await User.findByIdAndUpdate(booking.customer, {
    $push: {
      notifications: {
        message: `Your job for ${booking.service} has been marked completed`,
        time: new Date(),
        read: false,
        bookingId: booking._id,
      }
    }
  });

  res.json({ message: "Job completed successfully" });
});

// 🔥 UPDATE PROVIDER LIVE LOCATION
router.put("/update-location", authMiddleware, requireProvider, async (req, res) => {
  try {
    const { lat, lng, bookingId } = req.body;

    await Booking.findByIdAndUpdate(bookingId, {
      providerLiveLocation: { lat, lng }
    });

    res.json({ message: "Provider location updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update location" });
  }
});

router.post("/request-otp/:bookingId", authMiddleware, requireProvider, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.assignedProvider.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    booking.completionOTP = otp;
    booking.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    booking.status = "waiting_customer_verification";

    await booking.save();

    res.json({
      message: "OTP generated successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP generation failed" });
  }
});

router.post("/verify-otp/:bookingId", authMiddleware, requireProvider, async (req, res) => {
  try {
    const { otp } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.assignedProvider.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (
      booking.completionOTP !== otp ||
      new Date() > booking.otpExpiresAt
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    booking.status = "completed";
    booking.completionOTP = null;
    booking.otpExpiresAt = null;

    await booking.save();

    res.json({ message: "Job completed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;

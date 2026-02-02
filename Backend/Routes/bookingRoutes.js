import express from "express";
import Booking from "../Models/Booking.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import User from "../Models/User.js";


const router = express.Router();

/* ------------------------------------
   CREATE BOOKING (Customer)
------------------------------------ */

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { service, location, preferredTime, additionalDetails, vehicle, model } = req.body;

    const finalLocation =
      typeof location === "string"
        ? { address: location }
        : location;

    const booking = new Booking({
      customer: req.user.id,
      service,
      vehicle,
      model,
      location: finalLocation,
      preferredTime,
      additionalDetails,
      status: "pending",
    });

    await booking.save();

    // Notify all providers of new request
    await User.updateMany(
      { usertype: "Service Provider" },
      {
        $push: {
          notifications: {
            message: `New ${service} request received`,
            read: false,
            bookingId: booking._id,
            time: new Date(),
          },
        },
      }
    );

    return res.status(201).json({ message: "Booking created", booking });

  } catch (err) {
    console.log("BOOKING CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

/* ------------------------------------
   GET CUSTOMER BOOKINGS
------------------------------------ */
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

/* ------------------------------------
   CANCEL BOOKING
------------------------------------ */
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.customer.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Unauthorized Request" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------
   Get ALL QUOTES for customer screen
------------------------------------ */
router.get("/quotes/:bookingId", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("quotes.provider", "name photo phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json({ quotes: booking.quotes });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error fetching quotes" });
  }
});

/* ------------------------------------
   CUSTOMER ACCEPT QUOTE
------------------------------------ */
router.post("/accept-quote", authMiddleware, async (req, res) => {
  try {
    const { bookingId, providerId, paymentMode } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update quotes
    booking.quotes = booking.quotes.map(q => {
      if (q.provider.toString() === providerId) {
        return { ...q._doc, status: "accepted" };
      }
      return { ...q._doc, status: "rejected" };
    });

    // Assign provider + payment mode
    booking.assignedProvider = providerId;
    booking.paymentMode = paymentMode;     // 🔥 NEW
    booking.paymentStatus = "pending";     // 🔥 NEW
    booking.status = "active";              // job starts

    await booking.save();

    res.json({
      message: "Quote accepted & payment mode saved",
      booking
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error accepting quote" });
  }
});


/* ------------------------------------
   TRACK ORDER (Initial + Provider assigned)
------------------------------------ */
router.get("/track/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("assignedProvider", "name phone");

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({
    booking,
    providerLocation: booking.providerLiveLocation || null,
  });
});

/* ------------------------------------
   LIVE LOCATION – customer fetches provider
------------------------------------ */
router.get("/location/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    res.json({
      customer: booking.location,
      provider: booking.providerLiveLocation
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch live location" });
  }
});

// router.post("/provider/verify-otp/:id", authMiddleware, async (req, res) => {
//   const { otp } = req.body;
//   const booking = await Booking.findById(req.params.id);

//   if (!booking) return res.status(404).json({ message: "Booking not found" });

//   if (booking.otp !== otp)
//     return res.status(400).json({ message: "Invalid OTP" });

//   booking.status = "completed";
//   await booking.save();

//   res.json({ message: "Job completed" });
// });

// 🔐 Customer fetch OTP
router.get("/otp/:bookingId", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.customer.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (booking.status !== "waiting_customer_verification")
      return res.json({ otp: null });

    res.json({
      otp: booking.completionOTP,
      expiresAt: booking.otpExpiresAt,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch OTP" });
  }
});

// CUSTOMER ACCEPTS A PROVIDER QUOTE
router.post("/choose-provider/:bookingId", authMiddleware, async (req, res) => {
  try {
    const { providerId, price, paymentMode } = req.body;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // 1️⃣ Update quote statuses
    booking.quotes = booking.quotes.map((q) => {
      if (q.provider.toString() === providerId) {
        return { ...q._doc, status: "accepted" };
      }
      return { ...q._doc, status: "rejected" };
    });

    // 2️⃣ Assign provider & activate job
    booking.assignedProvider = providerId;
    booking.finalPrice = price;
    booking.paymentMode = paymentMode || "cash";
    booking.status = "accepted";          // 🔥 THIS MAKES ACTIVE JOB
    booking.activeStartTime = new Date();

    await booking.save();

    // 3️⃣ Notify provider
    await User.findByIdAndUpdate(providerId, {
      $push: {
        notifications: {
          message: `Customer accepted your quote for ${booking.service}`,
          bookingId: booking._id,
          time: new Date(),
          read: false,
        },
      },
    });

    res.json({
      message: "Provider selected successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error selecting provider" });
  }
});

export default router;

import express from "express";
import Booking from "../Models/Booking.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import User from "../Models/User.js"

const router = express.Router();

// 🟩 Create new booking
router.post("/create", authMiddleware, async (req, res) => {
  try {
    let { service, location, estimatedDistance } = req.body;

    // 🔹 Location handling
    let finalLocation = {};
    if (typeof location === "string") {
      finalLocation.address = location;
    } else {
      finalLocation = location; // { latitude, longitude, address }
    }

    const basePrice = 200;
    const pricePerKm = 20;
    const distancePrice = estimatedDistance * pricePerKm;
    const totalPrice = basePrice + distancePrice;

    const booking = new Booking({
      customer: req.user.id,
      service,
      location: finalLocation,
      basePrice,
      distancePrice,
      totalPrice,
      status: "pending",
    });

    await booking.save();

    // 🔔 Push notification to all providers
    await User.updateMany(
      { usertype: "Service Provider" },
      {
        $push: {
          notifications: {
            message: `New ${service} request received`,
            time: new Date(),
            read: false,
            bookingId: booking._id,
          },
        },
      }
    );

    return res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.log("BOOKING CREATE ERROR:", err);
    return res.status(500).json({ message: "Error creating booking" });
  }
});




// 🟦 Get all bookings for a user
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(requestId);
    console.log(booking)
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.customer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized Request" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be canceled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking Cancelled Successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/choose-provider/:id", authMiddleware, async (req, res) => {
  try {
    const { providerId, price } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.assignedProvider = providerId;
    booking.finalPrice = price;
    booking.status = "accepted";
    await booking.save();

    res.json({ message: "Provider selected", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ Get all quotes for a booking (Customer View)
router.get("/quotes/:bookingId", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("quotes.provider", "name photo phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ quotes: booking.quotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching quotes" });
  }
});


export default router;

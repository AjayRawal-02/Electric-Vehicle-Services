import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  activeStartTime: Date,
  providerLocation: {
    latitude: Number,
    longitude: Number
  },
  additionalDetails: { type: String },
  customerLocation: {
    latitude: Number,
    longitude: Number
  },
  providerLiveLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },

  preferredTime: Date,
  status: { type: String, default: "pending" },  // pending → quotes → accepted → completed

  quotes: [
    {
      provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 🔥 FIXED
      price: Number,
      status: { type: String, default: "pending" }
    }
  ],

  assignedProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  finalPrice: Number
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

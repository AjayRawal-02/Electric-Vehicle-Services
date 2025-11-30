import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  preferredTime: Date,
  status: { type: String, default: "pending" },   // pending → waiting for quotes → accepted → completed
  quotes: [quoteSchema],                          // <---- ADD
  assignedProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  finalPrice: Number
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

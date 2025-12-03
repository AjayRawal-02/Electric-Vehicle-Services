import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    usertype: { type: String, required: true }, // "Service Seeker" or "Service Provider"
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notifications: [
      {
        message: String,
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ]
    ,
    // ⬇ Common Profile Fields
    address: { type: String, default: "" },
    photo: { type: String, default: "" }, // base64 image

    // ⬇ Service Provider Specific Fields
    serviceType: { type: String, default: "" },   // ex: Battery Repair
    experience: { type: String, default: "" },    // ex: 3 years
    workingArea: {
      type: String, default: "", address: String,
      latitude: Number,
      longitude: Number,
    },   // ex: Jaipur, Ajmer Road
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

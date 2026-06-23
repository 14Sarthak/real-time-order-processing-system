const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    vehicle: { type: String, default: "Bike" },
    isAvailable: { type: Boolean, default: true, index: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true },
);

driverSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Driver", driverSchema);

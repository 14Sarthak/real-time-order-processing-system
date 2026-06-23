const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const orderEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    progress: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    restaurantName: { type: String, required: true, trim: true },
    items: [{ type: String, trim: true }],
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["ORDER_PLACED", "ORDER_ACCEPTED", "DRIVER_ASSIGNED", "PICKED_UP", "DELIVERED"],
      default: "ORDER_PLACED",
      index: true,
    },
    progress: { type: Number, default: 10 },
    customerLocation: { type: locationSchema, required: true },
    restaurantLocation: { type: locationSchema, required: true },
    driver: {
      id: String,
      name: String,
      vehicle: String,
      distanceKm: Number,
    },
    events: [orderEventSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);

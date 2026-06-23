const express = require("express");
const { v4: uuid } = require("uuid");
const { createOrder, listOrders, findOrderByCode } = require("../repositories/orderRepository");
const { runOrderPipeline } = require("../services/orderPipeline");
const { broadcast } = require("../realtime/socket");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      customerName = "Aarav",
      restaurantName = "Urban Tandoor",
      items = ["Paneer roll", "Masala fries"],
      amount = 499,
      customerLocation = { lat: 12.9784, lng: 77.6041 },
      restaurantLocation = { lat: 12.9716, lng: 77.5946 },
    } = req.body;

    const order = await createOrder({
      orderCode: `ORD-${uuid().slice(0, 8).toUpperCase()}`,
      customerName,
      restaurantName,
      items,
      amount,
      customerLocation,
      restaurantLocation,
      events: [
        {
          type: "ORDER_PLACED",
          message: "Order placed",
          progress: 10,
        },
      ],
    });

    broadcast({
      type: "ORDER_CREATED",
      order,
      event: order.events[0],
    });

    runOrderPipeline(order._id).catch((error) => {
      console.error("Order pipeline failed:", error);
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const orders = await listOrders();
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

router.get("/:orderCode", async (req, res, next) => {
  try {
    const order = await findOrderByCode(req.params.orderCode);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const env = require("../config/env");

const {
  findOrderById,
  updateOrderStage,
} = require("../repositories/orderRepository");

const { findNearestDriver } = require("./driverService");

const { broadcast } = require("../realtime/socket");

const { publish } = require("./kafkaSimulator");

const { acceptOrder } = require("./restaurantService");

const { sendNotification } = require("./notificationService");

const lifecycle = [
  {
    status: "ORDER_ACCEPTED",
    progress: 30,
    message: "Restaurant accepted the order",
  },

  {
    status: "DRIVER_ASSIGNED",
    progress: 50,
    message: "Nearest driver assigned",
  },

  {
    status: "PICKED_UP",
    progress: 75,
    message: "Driver picked up the order",
  },

  {
    status: "DELIVERED",
    progress: 100,
    message: "Order delivered successfully",
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function broadcastOrderUpdate(order, stage) {
  broadcast({
    type: "ORDER_UPDATED",

    order,

    event: {
      type: stage.status,

      message: stage.message,

      progress: stage.progress,
    },
  });
}

async function runOrderPipeline(orderId) {
  try {
    for (const stage of lifecycle) {
      await wait(env.orderStageDelayMs);

      const order = await findOrderById(orderId);

      if (!order) return;

      /* ---------- KAFKA SIMULATOR ---------- */

      publish(stage.status, {
        orderCode: order.orderCode,
      });

      /* ---------- RESTAURANT ---------- */

      if (stage.status === "ORDER_ACCEPTED") {
        acceptOrder(order);
      }

      /* ---------- DRIVER ---------- */

      let driver;

      if (stage.status === "DRIVER_ASSIGNED") {
        driver = await findNearestDriver(
          order.restaurantLocation
        );

        driver =
          driver || {
            id: "MANUAL",

            name: "Manual assignment pending",

            vehicle: "Unknown",

            distanceKm: 0,
          };
      }

      /* ---------- DATABASE UPDATE ---------- */

      const updatedOrder = await updateOrderStage(
        orderId,
        stage,
        driver
      );

      /* ---------- NOTIFICATION ---------- */

      sendNotification({
        message: stage.message,
      });

      /* ---------- WEBSOCKET ---------- */

      broadcastOrderUpdate(
        updatedOrder,
        stage
      );
    }
  } catch (error) {
    console.error(
      "Order pipeline error:",
      error
    );
  }
}

module.exports = {
  runOrderPipeline,
};
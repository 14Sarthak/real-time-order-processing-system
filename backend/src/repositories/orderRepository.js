const Order = require("../models/Order");

let memoryOrders = [];

function isMongoEnabled() {
  return Boolean(process.env.MONGO_URI);
}

async function createOrder(data) {

  if (!isMongoEnabled()) {

    const order = {

      _id: Date.now().toString(),

      status: "ORDER_PLACED",

      progress: 10,

      createdAt: new Date(),

      ...data,

    };

    memoryOrders.unshift(order);

    return order;
  }

  return await Order.create(data);
}

async function listOrders() {

  if (!isMongoEnabled()) {

    return memoryOrders;
  }

  return await Order.find()

    .sort({ createdAt: -1 })

    .lean();
}

async function findOrderByCode(orderCode) {

  if (!isMongoEnabled()) {

    return memoryOrders.find(

      (order) => order.orderCode === orderCode

    );
  }

  return await Order.findOne({ orderCode });
}

async function findOrderById(id) {

  if (!isMongoEnabled()) {

    return memoryOrders.find(

      (order) => order._id === id

    );
  }

  return await Order.findById(id);
}

async function updateOrderStage(

  id,

  stage,

  driver

) {

  if (!isMongoEnabled()) {

    const order = memoryOrders.find(

      (order) => order._id === id

    );

    if (!order) return null;

    order.status = stage.status;

    order.progress = stage.progress;

    if (driver) {

      order.driver = driver;
    }

    order.events.push({

      type: stage.status,

      message: stage.message,

      progress: stage.progress,

      createdAt: new Date(),

    });

    return order;
  }

  const order = await Order.findById(id);

  if (!order) return null;

  order.status = stage.status;

  order.progress = stage.progress;

  if (driver) {

    order.driver = driver;
  }

  order.events.push({

    type: stage.status,

    message: stage.message,

    progress: stage.progress,

  });

  return await order.save();
}

module.exports = {

  createOrder,

  listOrders,

  findOrderByCode,

  findOrderById,

  updateOrderStage,

};
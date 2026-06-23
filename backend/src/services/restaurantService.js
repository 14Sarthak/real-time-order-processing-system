function acceptOrder(order) {
  console.log(
    `[Restaurant] ${order.orderCode} accepted`
  );

  return order;
}

module.exports = {
  acceptOrder,
};
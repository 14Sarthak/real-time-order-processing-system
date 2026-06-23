function sendNotification(event) {
  console.log(
    `[Notification] ${event.message}`
  );
}

module.exports = {
  sendNotification,
};
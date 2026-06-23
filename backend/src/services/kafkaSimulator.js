function publish(topic, payload) {
  console.log(
    `[Kafka] ${topic}`,
    payload
  );
}

module.exports = {
  publish,
};
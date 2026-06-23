const http = require("http");
const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");
const { setupRealtime } = require("./realtime/socket");
const { ensureSeedDrivers } = require("./services/driverService");

async function bootstrap() {
  await connectDatabase();
  await ensureSeedDrivers();

  const server = http.createServer(app);
  setupRealtime(server);

  server.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
    console.log(`WebSocket running on ws://localhost:${env.port}/ws`);
  });
}

bootstrap().catch((error) => {
  console.error("Backend failed to start:", error.message);
  process.exit(1);
});

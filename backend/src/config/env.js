const dotenv = require("dotenv");

dotenv.config({ path: "backend/.env" });
dotenv.config();

const env = {
  port: Number(process.env.PORT || 4401),
  mongoUri: process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:4174",
  orderStageDelayMs: Number(process.env.ORDER_STAGE_DELAY_MS || 2500),
};

module.exports = env;

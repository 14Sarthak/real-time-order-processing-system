const cors = require("cors");
const express = require("express");
const env = require("./config/env");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => {

  res.json({

    status: "ok",

    service: "order-processing-backend",

    timestamp: new Date().toISOString(),

  });

});

app.use("/api/orders", orderRoutes);

app.use((err, _req, res, _next) => {

  console.error(err);

  res.status(err.status || 500).json({

    message: err.message || "Internal server error",

  });

});

module.exports = app;
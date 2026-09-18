const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const path = require("path");

const app = express();

// CORS - allow configured origins + localhost for dev
const allowedOrigins = [
  "https://rhhcinvoice.cloud",
  "https://www.rhhcinvoice.cloud",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // Add your domain here if different
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In production, also allow same-origin (nginx proxy)
      if (process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }
      callback(null, true); // Allow all in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
}));
app.options('*', cors());

app.use(express.json({ limit: "20mb" }));
app.use(morgan("dev"));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

module.exports = app;

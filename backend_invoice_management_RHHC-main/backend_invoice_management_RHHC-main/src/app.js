const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const path = require("path");

const app = express();

app.use(cors({
    origin: ["https://rhhcinvoice.cloud", "https://www.rhhcinvoice.cloud", "http://localhost:3000"],
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
//

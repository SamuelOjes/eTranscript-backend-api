const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/mdberrorHandler.js");
const errorResponse = require("./utils/errorResponse");

// Initalise Routes
const auth = require("./routes/authRoutes");
const user = require("./routes/userRoutes");
const student = require("./routes/studentRoutes");
const contact = require("./routes/contactRoutes");
const recipient = require("./routes/recipientRoutes");
const processing = require("./routes/processingRoutes");
const enquiry = require("./routes/enquiryRoutes");

// load Env Variable
require("dotenv").config({
  path: "./config/config.env",
});

// Initialising Express
const app = express();

// Cookie Parser
app.use(cookieParser());

// Initialising Express to use JSON
app.use(
  express.json({
    extended: false,
  })
);

// Dev Logging Middleware
if (process.env.NODE_ENV === "development") {
  // Cors helps to deal with react for localhost at port 6000 without any problem
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  // Config only for development
  app.use(morgan("dev"));
}

// Set Static Folder Path
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS
// app.use(cors());

// Mount Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/students", student);
app.use("/api/v1/contacts", contact);
app.use("/api/v1/recipient", recipient);
app.use("/api/v1/processing", processing);
app.use("/api/v1/enquiry", enquiry);

// Capture Errors for Routes that do not exist
app.all("*", (req, res, next) => {
  next(new errorResponse(`Requested url ${req.originalUrl} not found`, 404));
});

// Middleware For routes that do not exist
app.use((req, res, next) => {
  res.status(404).json({
    succes: false,
    message: "Page Not Found",
  });
});
// @desc Error Handler middleware should always be below the routes to catch the errors and not cause code block
app.use(errorHandler);

module.exports = app;

// Require mongoose
const mongoose = require("mongoose");

// Require LocalDB connection string
require(".././config/config.env");

// Set Up MongoDB database URI
const localDbURI = LOCALDBCONNECTION;
const mongoURI = MONGO_URI;

// Setup mongoose conncection
const connectDB = async () => {
  const conn = await mongoose.connect(localDbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`Mongodb connected: ${conn.connection.host}`.blue);
};

module.exports = connectDB;

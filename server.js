// Require MongoDb database connection
const connectDB = require('./config/db')
// Require colors for concole colors
const colors = require("colors");

// Call Db connection to database
connectDB();

// Require Express config file
const app = require('./app')

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App running on port ${port}`.yellow)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    // app.close(() => process.exit(1));
});
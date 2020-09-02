// Require Mongoose
const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Provide a Title"],
  },
  message: {
    type: String,
    required: [true, "Please Provide a Body of your Message"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

module.exports = mongoose.model("Enquiry", EnquirySchema);

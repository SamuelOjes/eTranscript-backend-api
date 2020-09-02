// Require Mongoose
const mongoose = require("mongoose");

const RecipientSchema = new mongoose.Schema({
  transcriptRecipient: {
    type: String,
    required: [true, "Please Provide who/whom you are sending the transcript to"],
  },
  country: {
    type: String,
    required: true,
    maxlength: [25, "Country cannot be empty"],
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: [true, "Please Provide an Address"],
  },
  department: {
    type: String,
    required: [true, "Please Provide Department Office you want transcript sent to"],
  },
  referenceNumber: {
    type: String,
    required: [true, "Please Provide Receivers Reference Number"],
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

module.exports = mongoose.model("Recipient", RecipientSchema);

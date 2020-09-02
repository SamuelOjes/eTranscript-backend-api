// Require Mongoose
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  address1: {
    type: String,
    required: [true, "Please Enter an Address"],
  },
  address2: {
    type: String,
    required: () => (this.address1 = null),
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
    maxlength: [15, "Zip/Postal code cannot be empty"],
  },
  country: {
    type: String,
    required: true,
    maxlength: [25, "Country cannot be empty"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    required: [true, "What is your contact number"],
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

module.exports = mongoose.model("Contact", ContactSchema);

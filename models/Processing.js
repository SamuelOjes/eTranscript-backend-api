// Require Mongoose
const mongoose = require("mongoose");

const ProcessTranscriptSchema = new mongoose.Schema({
  whichtranscript: {
    type: String,
    required: [true, "Please Provide Type of Transcript You Want"],
  },
  typeoftranscript: {
    type: String,
    required: [true, "Please Tell us the kind of Transcript you want"],
  },
  whyorderingtranscript: {
    type: String,
    required: true,
  },
  deliveryinfo: {
    type: String,
    required: [true, "How Do you want your transcript delivered?"],
  },
  copiesoftranscript: {
    type: String,
    required: [true, "Please Provide How Many Copies of Your Transcript Do You Want Delivered"],
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

module.exports = mongoose.model("ProcessTranscript", ProcessTranscriptSchema);

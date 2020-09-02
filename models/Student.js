// Require Mongoose
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  matricnumber: {
    type: Number,
    required: [true, "Please Provide your matric number"],
    unique: true,
  },
  surname: {
    type: String,
    required: [true, "Please Provide your Surname"],
  },
  firstname: {
    type: String,
    required: [true, "Please Provide your Surname"],
  },
  middlename: {
    type: String,
    required: [true, "Please Provide your middlename"],
  },
  college: {
    type: String,
    required: [true, "Please what college did you attend?"],
  },
  department: {
    type: String,
    required: [true, "Please provide course offered"],
  },
  modeofadmission: {
    type: String,
    required: [true, "Please provide mode of admission"],
  },
  changeddepartment: {
    type: String,
    required: [true, "Let us know if you changed department"],
  },
  yearofadmission: {
    type: Number,
    required: true,
  },
  yearofgraduation: {
    type: Number,
    required: true,
  },
  transferedfromuni: {
    type: String,
    required: true,
  },
  nameofunitransfered: {
    type: String,
  },
  leveltransferedto: {
    type: Number,
    required: () => this.nameOfUniTransfered != null,
  },
  degreeawarded: {
    type: String,
    required: [true, "Please Provide Degree Awarded"],
  },
  classofdegree: {
    type: String,
    required: [true, "Please Provide The Class of Degree Awarded"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);

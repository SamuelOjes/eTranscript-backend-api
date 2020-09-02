// Require Mongoose
const mongoose = require("mongoose");
// Require Crypto
const crypto = require("crypto");
// Require Bcrypt for encrypting passwords
const bcrypt = require("bcryptjs");
// Require JsonWebToken
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      unique: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Encrypt Password Using Bcrypt - password won't be displayed as ordinary text when saved
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Sign JWT Token to user,employer, hod, admin and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

// Check User Entered password rto Hashed Password in Db during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Check if user changed password after token was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Generate and Hash the Password Token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash Token and set to reset Password field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set Expiry Date for Hashed resetPassword Token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);

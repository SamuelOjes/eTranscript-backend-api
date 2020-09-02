// @desc Require Token using crypto
const crypto = require("crypto");

// @desc Require errorResponse Util
const ErrorResponse = require("../utils/errorResponse");

// @desc Require asycnHanler Util
const asyncHandler = require("../utils/asyncHandler");

// @desc Require SendEmails Utils
const sendEmail = require("../utils/sendEmail");

// @desc Require User Model
const User = require("../models/User");

// @desc Create New User
// @desc POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  // Create User
  const newUser = await User.create({
    email,
    name,
    password,
    passwordConfirm,
  });

  // Create User Token from createSendtoken
  createSendToken(newUser, 201, res);
});

// @desc    LOGIN User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if Email and Password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide Email and Password", 400));
  }

  // 2) Check if user exists && password is correct

  // Check User Existence
  const user = await User.findOne({
    email,
  }).select("+password");
  // If user doesnt exist
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Check if Password Match
  const passIsMatch = await user.matchPassword(password);
  if (!passIsMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // 3) If everything is Ok send token to client
  createSendToken(user, 200, res);
});

// @desc    Logout Current User Out / Clear Cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", "none", options);

  res.status(200).json({
    success: true,
  });
});

// @desc    Check Current User
// @route   GET /api/v1/auth/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update Current User Details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  // User Fields to Update
  const fieldsToUpdate = {
    email: req.body.email,
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  createSendToken(user, 200, res);
});

// @desc    Update Current User Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if current password match
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is Incorrect", 401));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Create User token from sendTokenResponse
  createSendToken(user, 200, res);
});

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  // Check If user Exists
  if (!user) {
    return next(new ErrorResponse("The email doesn't exist", 404));
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false,
  });

  //  Create Reset Url protocol - http, host - hostname token - resetpassword token
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your Account Password",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Reset Password Email Sent",
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });
    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Reset User Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetUserPassword = asyncHandler(async (req, res, next) => {
  // 1)Get user Hashed Token from the Database
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

  // 2) If token has not expired, and there is user, set the new password
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // 3) Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Create User token from sendTokenResponse
  createSendToken(user, 200, res);
});

// @desc    Delete User
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/User
exports.deleteMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User with ${req.params.id} id Cannot be Found`, 404));
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token from model , create and send the response(token) as a cookie to be stored in browsers
const createSendToken = (user, statusCode, res) => {
  // Get and Create User Signed Token
  const token = user.getSignedJwtToken();

  // Options Object that tells when token would expire
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };

  // Set Cookie Secure Flag to True in Production Environment
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.cookie("token", token, options);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

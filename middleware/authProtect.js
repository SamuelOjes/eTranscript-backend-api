// Require JWT token for Token Verification
const jwt = require("jsonwebtoken");
// Require ErrorResponse Util
const ErrorResponse = require(".././utils/errorResponse");
// Require AsyncHandler Util
const asyncHandler = require(".././utils/asyncHandler");
// Require User Model
const User = require(".././models/User");

// Protect Routes for Authentication
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set Token From Bearer Token in Header
    token = req.headers.authorization.split(" ")[1];
  }
  // Set Token From Cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //   Make sure token exist
  if (!token) {
    return next(new ErrorResponse("You are not logged in! Please log in to get access.", 401));
  }

  // 2) Verification token - decode and verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new ErrorResponse("The user belonging to this token no longer exists.", 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new ErrorResponse("User recently changed password! Please log in again.", 401));
    }

    // 5) GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Only for rendered pages, no errors!
exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

// Grant access to Specific Roles Authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("You do not have permission to perform this action", 403));
    }
    next();
  };
};

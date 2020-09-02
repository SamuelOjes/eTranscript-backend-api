const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const Enquiry = require(".././models/Enquiry");

// @desc    Get all enquiry
// @route   GET /api/v1/enquiry
// @access  Private/Admin
exports.getAllEnquiries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advQueriesResults);
});

// @desc    Get Single Enquiry Record
// @route   GET /api/v1/enquiry/:id
// @access  Private/User/Admin
exports.getEnquiry = asyncHandler(async (req, res, next) => {
  // @desc Finding enquiry method need req.params.id
  const enquiry = await Enquiry.findById(req.params.id);
  // @desc for getting incorrectly formatted enquiry not in the database
  if (!enquiry) {
    return next(
      // Explicitly used to set an error
      // Correctly formatted but doesn't exist
      new ErrorResponse(`Enquiry with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: enquiry });
  // Not correctly formatted
});

// @desc    Create new enquiry
// @route   POST /api/v1/enquiry
// @access  Private
exports.createEnquiry = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for published enquiry
  const enquiryRecord = await Enquiry.findOne({ user: req.user.id });

  // If the user is not a enquiry they can only add more Enquiry Records
  if (enquiryRecord && req.user.role !== "student") {
    return next(new ErrorResponse(`The User with ID ${req.user.id} has already created an enquiry record`, 400));
  }
  // @desc calling enquiry create method and you need req.body
  const enquiry = await Enquiry.create(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    data: enquiry,
  });
});

// @desc    UPDATE enquiry record
// @route   PUT /api/v1/enquiry/:id
// @access  Private
exports.updateEnquiry = asyncHandler(async (req, res, next) => {
  let enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return next(new ErrorResponse(`Enquiry Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real Owner of Enquiry Records
  if (enquiry.user !== req.user.id && req.user.role !== "student") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this enquiry record`, 401));
  }

  enquiry = await Enquiry.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: enquiry });
});

// @desc     DELETE Enquiry
// @route   DELETE /api/v1/enquiry/:id
// @access  Private
exports.deleteEnquiry = asyncHandler(async (req, res, next) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    return next(new ErrorResponse(`Enquiry Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real owner of Enquiry Record
  if (enquiry.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this enquiry record`, 401));
  }

  // Trigger Removal of Enquiry Records
  enquiry.remove();

  res.status(200).json({ success: true, data: {} });
});

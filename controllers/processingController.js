const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const Processing = require(".././models/Processing");

// @desc    Get all Process
// @route   GET /api/v1/processing
// @access  Private/Admin
exports.getAllProcess = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advQueriesResults);
});

// @desc    Get Single Process Record
// @route   GET /api/v1/processing/:id
// @access  Private/User/Admin
exports.getProcess = asyncHandler(async (req, res, next) => {
  // @desc Finding student method need req.params.id
  const processing = await Processing.findById(req.params.id);
  // @desc for getting incorrectly formatted Process not in the database
  if (!processing) {
    return next(
      // Explicitly used to set an error
      // Correctly formatted but doesn't exist
      new ErrorResponse(`Process with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: processing });
  // Not correctly formatted
});

// @desc    Create new process
// @route   POST /api/v1/processing
// @access  Private
exports.createProcessRecord = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for published Process
  const processRecord = await Processing.findOne({ user: req.user.id });

  // If the user is not an admin they can only add one Process Record
  if (processRecord && req.user.role !== "admin") {
    return next(new ErrorResponse(`The User with ID ${req.user.id} has already created a process record`, 400));
  }
  // @desc calling processing create method and you need req.body
  const processing = await Processing.create(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    data: processing,
  });
});

// @desc    UPDATE processing record
// @route   PUT /api/v1/processing/:id
// @access  Private
exports.updateProcessRecord = asyncHandler(async (req, res, next) => {
  let processing = await Processing.findById(req.params.id);

  if (!processing) {
    return next(new ErrorResponse(`Processing Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real Owner of Processing Records
  if (processing.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this process record`, 401));
  }

  processing = await Processing.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: processing });
});

// @desc     DELETE processing
// @route   DELETE /api/v1/processing/:id
// @access  Private
exports.deleteProcessRecord = asyncHandler(async (req, res, next) => {
  const processing = await Processing.findById(req.params.id);
  if (!processing) {
    return next(new ErrorResponse(`Processing Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real owner of Processing Record
  if (processing.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this processing record`, 401));
  }

  // Trigger Removal of Processing Records
  processing.remove();

  res.status(200).json({ success: true, data: {} });
});

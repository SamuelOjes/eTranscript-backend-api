const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const Recipient = require(".././models/Recipient");

// @desc    Get all recipient
// @route   GET /api/v1/contacts
// @access  Private/Admin
exports.getAllRecipient = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advQueriesResults);
});

// @desc    Get Single Recipient Record
// @route   GET /api/v1/recipient/:id
// @access  Private/User/Admin
exports.getRecipient = asyncHandler(async (req, res, next) => {
  // @desc Finding recipient method need req.params.id
  const recipient = await Recipient.findById(req.params.id);
  // @desc for getting incorrectly formatted recipient not in the database
  if (!recipient) {
    return next(
      // Explicitly used to set an error
      // Correctly formatted but doesn't exist
      new ErrorResponse(`Recipient with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: recipient });
  // Not correctly formatted
});

// @desc    Create new recipient
// @route   POST /api/v1/recipient
// @access  Private
exports.createRecipientRecord = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for published recipient
  const recipientRecord = await Recipient.findOne({ user: req.user.id });

  // If the user is not an admin they can only add one RecipientRecord
  if (recipientRecord && req.user.role !== "admin") {
    return next(new ErrorResponse(`The User with ID ${req.user.id} has already created a recipient record`, 400));
  }
  // @desc calling recipient create method and you need req.body
  const recipient = await Recipient.create(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    data: recipient,
  });
});

// @desc    UPDATE recipient record
// @route   PUT /api/v1/recipient/:id
// @access  Private
exports.updateRecipientRecord = asyncHandler(async (req, res, next) => {
  let recipient = await Recipient.findById(req.params.id);

  if (!recipient) {
    return next(new ErrorResponse(`Recipient Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real Owner of Recipient Records
  if (recipient.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipient record`, 401));
  }

  recipient = await Recipient.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: recipient });
});

// @desc     DELETE Recipient
// @route   DELETE /api/v1/recipient/:id
// @access  Private
exports.deleteRecipientRecord = asyncHandler(async (req, res, next) => {
  const recipient = await Recipient.findById(req.params.id);
  if (!recipient) {
    return next(new ErrorResponse(`Recipient Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real owner of Recipient Record
  if (recipient.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this recipient record`, 401));
  }

  // Trigger Removal of Recipient Records
  recipient.remove();

  res.status(200).json({ success: true, data: {} });
});

const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const Contact = require(".././models/Contact");

// @desc    Get all contacts
// @route   GET /api/v1/contacts
// @access  Private/Admin
exports.getAllContact = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advQueriesResults);
});

// @desc    Get Single Contact Record
// @route   GET /api/v1/contact/:id
// @access  Private/User/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  // @desc Finding contact method need req.params.id
  const contact = await Contact.findById(req.params.id);
  // @desc for getting incorrectly formatted contacts not in the database
  if (!contact) {
    return next(
      // Explicitly used to set an error
      // Correctly formatted but doesn't exist
      new ErrorResponse(`Contact with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: contact });
  // Not correctly formatted
});

// @desc    Create new contact
// @route   POST /api/v1/contact
// @access  Private
exports.createContactRecord = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for published contactRecord
  const contactRecord = await Contact.findOne({ user: req.user.id });

  // If the user is not an admin they can only add one contact Record
  if (contactRecord && req.user.role !== "admin") {
    return next(new ErrorResponse(`The User with ID ${req.user.id} has already created a contact record`, 400));
  }
  // @desc calling contacts create method and you need req.body
  const contact = await Contact.create(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    data: contact,
  });
});

// @desc    UPDATE contact record
// @route   PUT /api/v1/contacts/:id
// @access  Private
exports.updateContactRecord = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real Owner of Contact Records
  if (contact.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this contact record`, 401));
  }

  contact = await Contact.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: contact });
});

// @desc     DELETE Contacts
// @route   DELETE /api/v1/contacts/:id
// @access  Private
exports.deleteContactRecord = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new ErrorResponse(`Contact Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real owner of Contact Record
  if (contact.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this student record`, 401));
  }

  // Trigger Removal of Contact Records
  contact.remove();

  res.status(200).json({ success: true, data: {} });
});

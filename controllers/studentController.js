const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const Student = require(".././models/Student");

// @desc    Get all students
// @route   GET /api/v1/students
// @access  Private/Admin
exports.getAllStudent = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advQueriesResults);
});

// @desc    Get Single Student Record
// @route   GET /api/v1/student/:id
// @access  Private/User/Admin
exports.getStudent = asyncHandler(async (req, res, next) => {
  // @desc Finding student method need req.params.id
  const student = await Student.findById(req.params.id);
  // @desc for getting incorrectly formatted student not in the database
  if (!student) {
    return next(
      // Explicitly used to set an error
      // Correctly formatted but doesn't exist
      new ErrorResponse(`Student with id of ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: student });
  // Not correctly formatted
});

// @desc    Create new student
// @route   POST /api/v1/student
// @access  Private
exports.createStudentRecord = asyncHandler(async (req, res, next) => {
  // Add User to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const studentRecord = await Student.findOne({ user: req.user.id });

  // If the user is not an admin they can only add one Student Record
  if (studentRecord && req.user.role !== "admin") {
    return next(new ErrorResponse(`The User with ID ${req.user.id} has already created a student record`, 400));
  }
  // @desc calling students create method and you need req.body
  const student = await Student.create(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    data: student,
  });
});

// @desc    UPDATE student record
// @route   PUT /api/v1/students/:id
// @access  Private
exports.updateStudentRecord = asyncHandler(async (req, res, next) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real Owner of Student Records
  if (student.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this student record`, 401));
  }

  student = await Student.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: student });
});

// @desc     DELETE Students
// @route   DELETE /api/v1/students/:id
// @access  Private
exports.deleteStudentRecord = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new ErrorResponse(`Student Record with id of ${req.params.id} not found`, 404));
  }

  // Make sure User is Real owner of Student Record
  if (student.user !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this student record`, 401));
  }

  // Trigger Removal of Student Records
  student.remove();

  res.status(200).json({ success: true, data: {} });
});

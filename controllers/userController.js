// @desc Require ErrorResponse Util
const ErrorResponse = require(".././utils/errorResponse");
// @desc Require asyncHandler middleware
const asyncHandler = require(".././utils/asyncHandler");
// Calling Bootcamp Model
const User = require(".././models/User");

// @desc    Get All Users
// @route   Get /api/v1/auth/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advQueriesResults);
});


// @desc    Get Single User By Id
// @route   Get /api/v1/auth/users/:id
// @access  Private/Admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Create User
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Update User
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(
            new ErrorResponse(`User with id ${req.params.id} not found`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc    Delete User
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorResponse(`User with ${req.params.id} id Cannot be Found`, 404)
        );
    }

    user.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
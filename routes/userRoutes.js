// Require Express
const express = require('express')

const {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
} = require(".././controllers/userController");

// Require User Model
const User = require('.././models/User')

// Require Express Router
const router = express.Router({
    mergeParams: true
});

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const {
    protect,
    authorize
} = require(".././middleware/authProtect");

router.use(protect);
router.use(authorize("admin"));

router.route("/")
    .get(advQueriesResults(User), getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router
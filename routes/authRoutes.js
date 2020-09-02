// Require Express
const express = require("express");

// Use destructuring to get arrays of controller Methods from authController
const { register, login, logout, forgotPassword, resetUserPassword, updateUserDetails, getCurrentUser, updateUserPassword, deleteMe } = require(".././controllers/authController");

// Calling Express Router
const router = express.Router();

// Require Protect middleware for authorized routes
const { protect, isLoggedIn } = require(".././middleware/authProtect");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.use(isLoggedIn);
router.get("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.put("/updatedetails", protect, updateUserDetails);
router.put("/resetpassword/:resettoken", resetUserPassword);
router.put("/updatepassword", protect, updateUserPassword);
router.delete("/deleteMe/:id", protect, deleteMe);

module.exports = router;

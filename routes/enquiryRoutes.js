const express = require("express");
// Using Destructuring to get files
const { getAllEnquiries, getEnquiry, createEnquiry, updateEnquiry, deleteEnquiry } = require(".././controllers/enquiryController");

// Require Model
const Enquiry = require(".././models/Enquiry");

// Require Express Router
const router = express.Router();

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const { protect, authorize } = require(".././middleware/authProtect");

router.route("/").get(advQueriesResults(Enquiry), protect, authorize("admin"), getAllEnquiries).post(protect, authorize("student", "admin"), createEnquiry);
router.get("/:id", protect, authorize("student", "admin"), getEnquiry);
router.put("/:id", protect, authorize("student", "admin"), updateEnquiry);
router.delete("/:id", protect, authorize("admin"), deleteEnquiry);

module.exports = router;

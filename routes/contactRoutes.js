const express = require("express");
// Using Destructuring to get files
const { getAllContact, getContact, createContactRecord, updateContactRecord, deleteContactRecord } = require(".././controllers/contactController");

// Require Model
const Contact = require(".././models/Contact");

// Require Express Router
const router = express.Router();

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const { protect, authorize } = require(".././middleware/authProtect");

router.route("/").get(advQueriesResults(Contact), protect, authorize("admin"), getAllContact).post(protect, authorize("student", "admin"), createContactRecord);
router.get("/:id", protect, authorize("student", "admin"), getContact);
router.put("/:id", protect, authorize("student", "admin"), updateContactRecord);
router.delete("/:id", protect, authorize("admin"), deleteContactRecord);

module.exports = router;

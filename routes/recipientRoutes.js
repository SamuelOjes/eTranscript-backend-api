const express = require("express");
// Using Destructuring to get files
const { getAllRecipient, getRecipient, createRecipientRecord, updateRecipientRecord, deleteRecipientRecord } = require(".././controllers/recipientController");

// Require Model
const Recipient = require(".././models/Recipient");

// Require Express Router
const router = express.Router();

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const { protect, authorize } = require(".././middleware/authProtect");

router.route("/").get(advQueriesResults(Recipient), protect, authorize("admin"), getAllRecipient).post(protect, authorize("student", "admin"), createRecipientRecord);
router.get("/:id", protect, authorize("student", "admin"), getRecipient);
router.put("/:id", protect, authorize("student", "admin"), updateRecipientRecord);
router.delete("/:id", protect, authorize("admin"), deleteRecipientRecord);

module.exports = router;

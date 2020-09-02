const express = require("express");
// Using Destructuring to get files
const { getAllProcess, getProcess, createProcessRecord, updateProcessRecord, deleteProcessRecord } = require(".././controllers/processingController");

// Require Model
const Processing = require(".././models/Processing");

// Require Express Router
const router = express.Router();

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const { protect, authorize } = require(".././middleware/authProtect");

router.route("/").get(advQueriesResults(Processing), protect, authorize("admin"), getAllProcess).post(protect, authorize("student", "admin"), createProcessRecord);
router.get("/:id", protect, authorize("student", "admin"), getProcess);
router.put("/:id", protect, authorize("student", "admin"), updateProcessRecord);
router.delete("/:id", protect, authorize("admin"), deleteProcessRecord);

module.exports = router;

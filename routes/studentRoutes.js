const express = require("express");
// Using Destructuring to get files
const { getAllStudent, getStudent, createStudentRecord, updateStudentRecord, deleteStudentRecord } = require(".././controllers/studentController");

// Require Model
const Student = require(".././models/Student");

// Require Express Router
const router = express.Router();

// Require Advance Queries MiddleWare
const advQueriesResults = require(".././middleware/advQueriesResults");
// Require Auth Protect and Authorize Middleware
const { protect, authorize } = require(".././middleware/authProtect");

router.route("/").get(advQueriesResults(Student), protect, authorize("admin"), getAllStudent).post(protect, authorize("student", "admin"), createStudentRecord);
router.get("/:id", protect, authorize("student", "admin"), getStudent);
router.put("/:id", protect, authorize("student", "admin"), updateStudentRecord);
router.delete("/:id", protect, authorize("admin"), deleteStudentRecord);

module.exports = router;

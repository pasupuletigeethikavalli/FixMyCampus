
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  deleteComplaint,
  updateComplaintStatus
} = require("../controllers/complaintController");

// All complaint routes require login
router.use(authMiddleware);

// Submit complaint
router.post("/", createComplaint);

// Get all complaints
router.get("/", getComplaints);

// Get logged-in user's complaints
router.get("/my", getMyComplaints);

// Update complaint status
router.put("/:id/status", updateComplaintStatus);

// Delete own pending complaint
router.delete("/:id", deleteComplaint);

module.exports = router;

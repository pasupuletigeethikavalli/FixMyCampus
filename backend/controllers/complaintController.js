
const Complaint = require("../models/Complaint");

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      priority
    } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      priority,
      submittedBy: req.user.id
    });

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint.",
      error: error.message
    });
  }
};


// Get all complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("submittedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints.",
      error: error.message
    });
  }
};


// Get logged-in user's complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      submittedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your complaints.",
      error: error.message
    });
  }
};


// Delete own complaint (ALL STATUSES)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      submittedBy: req.user.id
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete complaint.",
      error: error.message
    });
  }
};


// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status."
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.status(200).json({
      message: "Complaint status updated successfully!",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint status.",
      error: error.message
    });
  }
};


// Export all functions
module.exports = {
  createComplaint,
  getComplaints,
  getMyComplaints,
  deleteComplaint,
  updateComplaintStatus
};

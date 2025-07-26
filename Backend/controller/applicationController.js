
const Application = require('../models/Application');
const Job = require('../models/Job'); // Import the Job model
const mongoose = require ("mongoose");

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body; // Get the jobId from the form
    const studentId = req.student._id; // Get studentId from the authenticated user

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is missing' });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Student has already applied for this job' });
    }

    // Save application
    const application = new Application({
      studentId,
      jobId,
      resume: req.file.filename, // ✅ Just store the filename
    });

    await application.save();
    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update application status
// exports.updateApplicationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const application = await Application.findById(req.params.id);

//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     application.status = status || application.status;
//     await application.save();

//     res.status(200).json(application);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating application status', error });
//   }
// };

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }

    // Validate status value
    const allowedStatuses = ['pending', 'shortlisted', 'rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status value' });
    }   

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    // Fetch all applications and populate the jobId
    const applications = await Application.find().populate('jobId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};


exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.student._id;
    console.log("Student ID:", studentId); // Log student ID to check it's being passed correctly

    // Fetch all applications by the logged-in student
    const applications = await Application.find({ studentId })
      .populate('jobId', ' companyName location salary'); // Ensure 'companyName' is a field in 'Job' model

    console.log("Applications fetched:", applications); // Log the applications returned by the query

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to fetch applications', error });
  }
};
const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Register a new student
const registerStudent = async (req, res) => {
    const { name, email, password,course,batch } = req.body;

    try {
        // Check if student already exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Create new student
        const student = new Student({
            name,
            email,
            password,
            course,
            batch
        });

        // Save student to the database
        await student.save();

        // Generate JWT token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Student registered successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login student and generate JWT token
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await student.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getStudentDetails = async (req, res) => {
    const studentId = req.student._id; // Assume student is authenticated

    try {
        const studentDetails = await Student.getJobCounts(studentId);

        if (!studentDetails || studentDetails.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(studentDetails[0]); // Send the student details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');

    // Remove empty job-related arrays for each student
    const modifiedStudents = students.map(student => {
      const studentData = student.toObject();  // Convert student document to plain object
      
      // Remove empty job-related arrays
      if (!studentData.appliedJobs || studentData.appliedJobs.length === 0) {
        delete studentData.appliedJobs;
      }
      if (!studentData.rejectedJobs || studentData.rejectedJobs.length === 0) {
        delete studentData.rejectedJobs;
      }
      if (!studentData.shortlistedJobs || studentData.shortlistedJobs.length === 0) {
        delete studentData.shortlistedJobs;
      }
      
      return studentData;
    });

    res.json(modifiedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};
  

  const getStudentById = async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).select('-password');
      if (!student) return res.status(404).json({ message: 'Student not found' });
  
      // Convert student document to plain object to manipulate it
      const studentData = student.toObject();
  
      // Remove empty job-related arrays
      if (!studentData.appliedJobs || studentData.appliedJobs.length === 0) {
        delete studentData.appliedJobs;
      }
      if (!studentData.rejectedJobs || studentData.rejectedJobs.length === 0) {
        delete studentData.rejectedJobs;
      }
      if (!studentData.shortlistedJobs || studentData.shortlistedJobs.length === 0) {
        delete studentData.shortlistedJobs;
      }
  
      res.json(studentData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student', error });
    }
  };
  
  // Update student
  const updateStudent = async (req, res) => {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).select('-password');
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating student', error });
    }
  };
  
  // Delete student
  const deleteStudent = async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  };

  
  const getStudentWithApplications = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Fetch student profile
      const student = await Student.findById(studentId).select('-password');
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Remove empty job-related arrays from student object
      const studentData = student.toObject();
      if (!studentData.appliedJobs || studentData.appliedJobs.length === 0) {
        delete studentData.appliedJobs;
      }
      if (!studentData.rejectedJobs || studentData.rejectedJobs.length === 0) {
        delete studentData.rejectedJobs;
      }
      if (!studentData.shortlistedJobs || studentData.shortlistedJobs.length === 0) {
        delete studentData.shortlistedJobs;
      }
  
      // Fetch applications with populated job role and company name
      const applications = await Application.find({ studentId })
        .populate('jobId', 'role companyName')  // Populating role and company
        .select('jobId status appliedAt');
  
      // Transform applications to remove jobId and include role and company instead
      const transformedApplications = applications.map(app => {
        return {
          status: app.status,
          appliedAt: app.appliedAt,
          role: app.jobId?.role,  // Accessing the populated role
          companyName: app.jobId?.companyName, // Accessing the populated company
        };
      });
  
      res.status(200).json({
        student: studentData,
        applications: transformedApplications
      });
  
    } catch (error) {
      console.error("Error fetching student details:", error); // optional log
      res.status(500).json({
        message: 'Error fetching student details',
        error: error.message || error.toString()
      });
    }
  };

  const updateStudentProfile = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Extract fields from request body
      const {
        name,
        email,
        phone,
        course,
        batch,
        skills, // array of strings
      } = req.body;
  
      // Prepare update object
      const updateData = {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(course && { course }),
        ...(batch && { batch }),
      };
  
      // Handle skills array
      if (skills) {
        if (Array.isArray(skills)) {
          updateData.skills = skills;
        } else {
          // If it's a comma-separated string
          updateData.skills = skills.split(',').map(skill => skill.trim());
        }
      }
  
      // Handle profile photo if uploaded (requires multer middleware)
      if (req.file) {
        updateData.profilePhoto = req.file.path; // or req.file.filename if you store just the filename
      }
  
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        { $set: updateData },
        { new: true }
      ).select('-password');
  
      res.status(200).json({ message: 'Profile updated successfully', student: updatedStudent });
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };

module.exports = {
    registerStudent,
    loginStudent,
    getStudentDetails, 
    getAllStudents,
    getStudentDetails,
    deleteStudent,
    updateStudent,
    getStudentById,
    getStudentWithApplications,
    updateStudentProfile
};

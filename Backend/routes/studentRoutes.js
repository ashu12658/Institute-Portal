    const express = require('express');
const upload = require('../middleware/multer'); // Import the upload middleware for file uploads
const { 
    registerStudent,
    loginStudent,
    getStudentDetails, 
    getStudentWithApplications,
    getAllStudents,
    deleteStudent,
    updateStudent,
    getStudentById,
    updateStudentProfile
} = require('../controller/studentController'); 
const { protect ,protectAdminOrTPO} = require('../middleware/authmiddleware'); // protect middleware to authorize student

const router = express.Router();

// Route to register a new student
router.post('/register', registerStudent);

// Route to login a student and generate JWT token
router.post('/login', loginStudent);

// // Route to get job counts (applied, rejected, shortlisted)
// router.get('/job-counts', protect, getJobCounts);

// // Route to apply for a job
// router.post('/apply-job', protect, applyForJob);

router.get('/', protectAdminOrTPO, getAllStudents);

// Get single student
router.get('/:id',  getStudentById);//*

// Update student
router.put('/:id', protectAdminOrTPO, updateStudent);

// Delete student
router.delete('/:id', protectAdminOrTPO, deleteStudent);

router.get('/:id/details',  getStudentWithApplications);//*
router.put('/update/:id',  upload.single('profilePhoto'), updateStudentProfile);//student


module.exports = router;

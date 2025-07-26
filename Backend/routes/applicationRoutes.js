const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController'); // Import the application controller
const {protect, protectAdmin, protectTPO,protectAdminOrTPO } = require('../middleware/authmiddleware');
const upload = require('../middleware/upload'); // Import the upload middleware
// Application Routes
// router.post('/apply', protect,applicationController.applyForJob);//student
router.post('/apply',protect, upload.single('resume'), applicationController.applyForJob);

router.get('/student',protectAdminOrTPO, applicationController.getApplications);
router.put('/:id/status',protectAdminOrTPO, applicationController.updateApplicationStatus);
router.get('/my-applications', protect, applicationController.getMyApplications);//student

module.exports = router;

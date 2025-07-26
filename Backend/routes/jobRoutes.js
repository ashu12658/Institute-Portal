const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController'); 
const { protectAdmin, protectTPO, protectAdminOrTPO } = require('../middleware/authmiddleware');

// Job Routes
router.get('/', jobController.getAllJobs);//student
router.post('/create-job',protectAdminOrTPO, jobController.addJob);
router.get('/:id',protectAdminOrTPO, jobController.getJobById);
router.put('/:id',protectAdminOrTPO, jobController.updateJob);
router.delete('/:id',protectAdminOrTPO, jobController.deleteJob);

module.exports = router;

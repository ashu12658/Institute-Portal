const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { protectAdmin, protectTPO } = require('../middleware/authmiddleware');

// User Routes
router.post('/register', userController.registerUser);  // Register TPO/Admin
router.post('/login', userController.loginUser);         // Login TPO/Admin
router.get('/', protectAdmin, userController.getAllUsers);             // Get all users
router.get('/:id',protectAdmin, userController.getUserById);          // Get single user
router.put('/:id',protectAdmin,userController.updateUser);           // Update user
router.delete('/:id',protectAdmin, userController.deleteUser);        // Delete user

module.exports = router;

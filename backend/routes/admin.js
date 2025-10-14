const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

// Get dashboard statistics
router.get('/dashboard', adminController.getDashboard);

// Get all users
router.get('/users', adminController.getUsers);

// Get all stores
router.get('/stores', adminController.getStores);

// Get user by ID
router.get('/users/:id', adminController.getUserById);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;

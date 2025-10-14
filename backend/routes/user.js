const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { ratingValidation } = require('../middleware/validation');

// All routes require authentication and user role
router.use(authMiddleware);
router.use(requireRole('user'));

// Get all stores with ratings
router.get('/stores', userController.getStores);

// Get user's ratings
router.get('/ratings', userController.getUserRatings);

// Rate a store
router.post('/ratings', ratingValidation, userController.rateStore);

// Update rating
router.put('/ratings/:storeId', ratingValidation, userController.updateRating);

module.exports = router;

const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { storeValidation } = require('../middleware/validation');

// All routes require authentication and owner role
router.use(authMiddleware);
router.use(requireRole('owner'));

// Get owner's dashboard (all stores)
router.get('/dashboard', ownerController.getDashboard);

// Create a new store
router.post('/stores', storeValidation, ownerController.createStore);

// Get specific store
router.get('/stores/:id', ownerController.getStore);

// Get ratings for a store
router.get('/stores/:id/ratings', ownerController.getStoreRatings);

module.exports = router;

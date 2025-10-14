const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
  signupValidation, 
  loginValidation, 
  updatePasswordValidation 
} = require('../middleware/validation');

// Public routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.put('/update-password', authMiddleware, updatePasswordValidation, authController.updatePassword);

module.exports = router;

const { body, validationResult } = require('express-validator');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// User signup validation
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Name must be alphanumeric'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  body('role')
    .isIn(['admin', 'user', 'owner'])
    .withMessage('Role must be admin, user, or owner'),
  
  validate
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Update password validation
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character'),
  
  validate
];

// Store validation
const storeValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Store name must be alphanumeric'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  validate
];

// Rating validation
const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  validate
];

module.exports = {
  signupValidation,
  loginValidation,
  updatePasswordValidation,
  storeValidation,
  ratingValidation,
  validate
};

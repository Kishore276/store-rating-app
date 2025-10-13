const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error', 
          error: err.message 
        });
      }

      if (user) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const sql = `INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
      
      db.run(sql, [name, email, hashedPassword, address, role], function(err) {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Error creating user', 
            error: err.message 
          });
        }

        res.status(201).json({ 
          success: true, 
          message: 'User created successfully',
          userId: this.lastID
        });
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error', 
          error: err.message 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Generate token
      const token = generateToken(user);

      // Return user info (without password)
      const { password: _, ...userWithoutPassword } = user;

      res.json({ 
        success: true, 
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Logout (client-side token removal, but we can log it)
exports.logout = (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logout successful' 
  });
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user
    db.get('SELECT * FROM Users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error', 
          error: err.message 
        });
      }

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Current password is incorrect' 
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      db.run(
        'UPDATE Users SET password = ? WHERE id = ?',
        [hashedPassword, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Error updating password', 
              error: err.message 
            });
          }

          res.json({ 
            success: true, 
            message: 'Password updated successfully' 
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const db = require('../database/db');

// Get dashboard statistics
exports.getDashboard = (req, res) => {
  const stats = {};
  
  // Get total users
  db.get('SELECT COUNT(*) as count FROM Users', (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching stats', 
        error: err.message 
      });
    }
    stats.totalUsers = result.count;
    
    // Get total stores
    db.get('SELECT COUNT(*) as count FROM Stores', (err, result) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error fetching stats', 
          error: err.message 
        });
      }
      stats.totalStores = result.count;
      
      // Get total ratings
      db.get('SELECT COUNT(*) as count FROM Ratings', (err, result) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Error fetching stats', 
            error: err.message 
          });
        }
        stats.totalRatings = result.count;
        
        // Get user counts by role
        db.all('SELECT role, COUNT(*) as count FROM Users GROUP BY role', (err, roleCounts) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Error fetching stats', 
              error: err.message 
            });
          }
          
          stats.adminCount = 0;
          stats.userCount = 0;
          stats.ownerCount = 0;
          
          roleCounts.forEach(rc => {
            if (rc.role === 'admin') stats.adminCount = rc.count;
            if (rc.role === 'user') stats.userCount = rc.count;
            if (rc.role === 'owner') stats.ownerCount = rc.count;
          });
          
          res.json({ 
            success: true, 
            ...stats 
          });
        });
      });
    });
  });
};

// Get all users
exports.getUsers = (req, res) => {
  const { name, email, role, sort } = req.query;
  
  let sql = 'SELECT id, name, email, address, role, created_at FROM Users WHERE 1=1';
  const params = [];
  
  // Add filters
  if (name) {
    sql += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  
  if (email) {
    sql += ' AND email LIKE ?';
    params.push(`%${email}%`);
  }
  
  if (role) {
    sql += ' AND role = ?';
    params.push(role);
  }
  
  // Add sorting
  if (sort) {
    const [field, order] = sort.split(':');
    const allowedFields = ['name', 'email', 'role', 'created_at'];
    const allowedOrder = ['asc', 'desc'];
    
    if (allowedFields.includes(field) && allowedOrder.includes(order.toLowerCase())) {
      sql += ` ORDER BY ${field} ${order.toUpperCase()}`;
    }
  } else {
    sql += ' ORDER BY created_at DESC';
  }
  
  db.all(sql, params, (err, users) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching users', 
        error: err.message 
      });
    }
    
    res.json({ 
      success: true, 
      users 
    });
  });
};

// Get all stores
exports.getStores = (req, res) => {
  const { name, sort } = req.query;
  
  let sql = `
    SELECT 
      s.*,
      AVG(r.rating) as average_rating,
      COUNT(r.id) as rating_count
    FROM Stores s
    LEFT JOIN Ratings r ON s.id = r.store_id
  `;
  
  const params = [];
  
  // Add search filter
  if (name) {
    sql += ' WHERE s.name LIKE ?';
    params.push(`%${name}%`);
  }
  
  sql += ' GROUP BY s.id';
  
  // Add sorting
  if (sort) {
    const [field, order] = sort.split(':');
    const allowedFields = ['name', 'email', 'address', 'average_rating'];
    const allowedOrder = ['asc', 'desc'];
    
    if (allowedFields.includes(field) && allowedOrder.includes(order.toLowerCase())) {
      sql += ` ORDER BY ${field} ${order.toUpperCase()}`;
    }
  } else {
    sql += ' ORDER BY s.created_at DESC';
  }
  
  db.all(sql, params, (err, stores) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching stores', 
        error: err.message 
      });
    }
    
    res.json({ 
      success: true, 
      stores 
    });
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT id, name, email, address, role, created_at FROM Users WHERE id = ?',
    [id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error fetching user', 
          error: err.message 
        });
      }
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      res.json({ 
        success: true, 
        user 
      });
    }
  );
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  
  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ 
      success: false, 
      message: 'You cannot delete your own account' 
    });
  }
  
  // Check if user exists
  db.get('SELECT * FROM Users WHERE id = ?', [id], (err, user) => {
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
    
    // Delete user (cascade will delete associated stores and ratings)
    db.run('DELETE FROM Users WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error deleting user', 
          error: err.message 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'User deleted successfully' 
      });
    });
  });
};

const db = require('../database/db');

// Get all stores with average ratings
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
    const allowedFields = ['name', 'address', 'average_rating'];
    const allowedOrder = ['asc', 'desc'];
    
    if (allowedFields.includes(field) && allowedOrder.includes(order.toLowerCase())) {
      sql += ` ORDER BY ${field} ${order.toUpperCase()}`;
    }
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

// Get user's ratings
exports.getUserRatings = (req, res) => {
  const userId = req.user.id;
  
  const sql = `
    SELECT 
      r.*,
      s.name as store_name
    FROM Ratings r
    JOIN Stores s ON r.store_id = s.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;
  
  db.all(sql, [userId], (err, ratings) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching ratings', 
        error: err.message 
      });
    }
    
    res.json({ 
      success: true, 
      ratings 
    });
  });
};

// Rate a store
exports.rateStore = (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;
  
  // Check if store exists
  db.get('SELECT * FROM Stores WHERE id = ?', [storeId], (err, store) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error', 
        error: err.message 
      });
    }
    
    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Store not found' 
      });
    }
    
    // Check if user already rated this store
    db.get(
      'SELECT * FROM Ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId],
      (err, existingRating) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Database error', 
            error: err.message 
          });
        }
        
        if (existingRating) {
          return res.status(400).json({ 
            success: false, 
            message: 'You have already rated this store. Use update instead.' 
          });
        }
        
        // Insert rating
        const sql = 'INSERT INTO Ratings (user_id, store_id, rating) VALUES (?, ?, ?)';
        
        db.run(sql, [userId, storeId, rating], function(err) {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Error saving rating', 
              error: err.message 
            });
          }
          
          res.status(201).json({ 
            success: true, 
            message: 'Rating added successfully',
            ratingId: this.lastID
          });
        });
      }
    );
  });
};

// Update rating
exports.updateRating = (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;
  
  // Check if rating exists
  db.get(
    'SELECT * FROM Ratings WHERE user_id = ? AND store_id = ?',
    [userId, storeId],
    (err, existingRating) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error', 
          error: err.message 
        });
      }
      
      if (!existingRating) {
        return res.status(404).json({ 
          success: false, 
          message: 'Rating not found. Create a new rating first.' 
        });
      }
      
      // Update rating
      const sql = `
        UPDATE Ratings 
        SET rating = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND store_id = ?
      `;
      
      db.run(sql, [rating, userId, storeId], (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Error updating rating', 
            error: err.message 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Rating updated successfully' 
        });
      });
    }
  );
};

const db = require('../database/db');

// Get owner's stores with ratings
exports.getDashboard = (req, res) => {
  const ownerId = req.user.id;
  
  const sql = `
    SELECT 
      s.*,
      AVG(r.rating) as average_rating,
      COUNT(r.id) as rating_count
    FROM Stores s
    LEFT JOIN Ratings r ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;
  
  db.all(sql, [ownerId], (err, stores) => {
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

// Create a new store (optional feature for owners)
exports.createStore = (req, res) => {
  const { name, email, address } = req.body;
  const ownerId = req.user.id;
  
  // Check if store email already exists
  db.get('SELECT * FROM Stores WHERE email = ?', [email], (err, store) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error', 
        error: err.message 
      });
    }
    
    if (store) {
      return res.status(400).json({ 
        success: false, 
        message: 'A store with this email already exists' 
      });
    }
    
    // Insert new store
    const sql = 'INSERT INTO Stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
    
    db.run(sql, [name, email, address, ownerId], function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating store', 
          error: err.message 
        });
      }
      
      res.status(201).json({ 
        success: true, 
        message: 'Store created successfully',
        storeId: this.lastID
      });
    });
  });
};

// Get specific store details
exports.getStore = (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  
  const sql = `
    SELECT 
      s.*,
      AVG(r.rating) as average_rating,
      COUNT(r.id) as rating_count
    FROM Stores s
    LEFT JOIN Ratings r ON s.id = r.store_id
    WHERE s.id = ? AND s.owner_id = ?
    GROUP BY s.id
  `;
  
  db.get(sql, [id, ownerId], (err, store) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching store', 
        error: err.message 
      });
    }
    
    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Store not found or you do not own this store' 
      });
    }
    
    res.json({ 
      success: true, 
      store 
    });
  });
};

// Get ratings for a specific store
exports.getStoreRatings = (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.id;
  
  // First verify the owner owns this store
  db.get(
    'SELECT * FROM Stores WHERE id = ? AND owner_id = ?',
    [id, ownerId],
    (err, store) => {
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
          message: 'Store not found or you do not own this store' 
        });
      }
      
      // Get ratings
      const sql = `
        SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email
        FROM Ratings r
        JOIN Users u ON r.user_id = u.id
        WHERE r.store_id = ?
        ORDER BY r.created_at DESC
      `;
      
      db.all(sql, [id], (err, ratings) => {
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
    }
  );
};

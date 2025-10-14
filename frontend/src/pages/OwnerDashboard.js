import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../utils/api';
import Rating from 'react-rating';
import '../pages/UserDashboard.css';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const response = await ownerAPI.getDashboard();
      setStores(response.data.stores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Owner Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Stores</h3>
          <div className="stat-value">{stores.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <div className="stat-value">
            {stores.reduce((sum, store) => sum + (store.rating_count || 0), 0)}
          </div>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="stat-value">
            {stores.length > 0 
              ? (stores.reduce((sum, store) => 
                  sum + (parseFloat(store.average_rating) || 0), 0) / stores.length
                ).toFixed(2)
              : '0.00'
            }
          </div>
        </div>
      </div>

      <h2>My Stores</h2>
      
      {stores.length === 0 ? (
        <div className="no-data">You don't have any stores yet.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.average_rating ? (
                      <>
                        <Rating
                          initialRating={parseFloat(store.average_rating)}
                          readonly
                          emptySymbol="☆"
                          fullSymbol="★"
                          fractions={2}
                        />
                        <span className="rating-value">
                          ({parseFloat(store.average_rating).toFixed(2)})
                        </span>
                      </>
                    ) : (
                      <span className="no-rating">No ratings yet</span>
                    )}
                  </td>
                  <td>{store.rating_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

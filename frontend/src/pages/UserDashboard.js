import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import Rating from 'react-rating';
import './UserDashboard.css';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesResponse, ratingsResponse] = await Promise.all([
        userAPI.getStores(),
        userAPI.getRatings()
      ]);
      
      setStores(storesResponse.data.stores || []);
      
      // Convert ratings array to object for easy lookup
      const ratingsMap = {};
      if (ratingsResponse.data.ratings) {
        ratingsResponse.data.ratings.forEach(rating => {
          ratingsMap[rating.store_id] = rating.rating;
        });
      }
      setUserRatings(ratingsMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      if (userRatings[storeId]) {
        await userAPI.updateRating(storeId, rating);
      } else {
        await userAPI.rateStore(storeId, rating);
      }
      
      setUserRatings(prev => ({
        ...prev,
        [storeId]: rating
      }));
      
      // Refresh stores to get updated average ratings
      const storesResponse = await userAPI.getStores();
      setStores(storesResponse.data.stores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredStores = () => {
    let filteredStores = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filteredStores.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'average_rating') {
          aValue = aValue || 0;
          bValue = bValue || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredStores;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>User Dashboard - Rate Stores</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Store Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Email</th>
              <th onClick={() => handleSort('address')} className="sortable">
                Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('average_rating')} className="sortable">
                Avg Rating {sortConfig.key === 'average_rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Your Rating</th>
            </tr>
          </thead>
          <tbody>
            {getSortedAndFilteredStores().length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No stores found</td>
              </tr>
            ) : (
              getSortedAndFilteredStores().map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.average_rating ? (
                      <Rating
                        initialRating={parseFloat(store.average_rating)}
                        readonly
                        emptySymbol="☆"
                        fullSymbol="★"
                        fractions={2}
                      />
                    ) : (
                      <span className="no-rating">No ratings yet</span>
                    )}
                    {store.average_rating && (
                      <span className="rating-value"> ({parseFloat(store.average_rating).toFixed(1)})</span>
                    )}
                  </td>
                  <td>
                    <Rating
                      initialRating={userRatings[store.id] || 0}
                      onChange={(rating) => handleRating(store.id, rating)}
                      emptySymbol="☆"
                      fullSymbol="★"
                    />
                    {userRatings[store.id] && (
                      <span className="rating-value"> ({userRatings[store.id]})</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;

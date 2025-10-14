import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import '../pages/UserDashboard.css';
import '../pages/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('overview'); // overview, users, stores
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, usersResponse, storesResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
        adminAPI.getStores()
      ]);
      
      setStats(dashboardResponse.data);
      setUsers(usersResponse.data.users || []);
      setStores(storesResponse.data.stores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredData = (data, isUserData = true) => {
    let filteredData = data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
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

    return filteredData;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="view-tabs">
        <button 
          className={`tab-button ${view === 'overview' ? 'active' : ''}`}
          onClick={() => setView('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${view === 'users' ? 'active' : ''}`}
          onClick={() => setView('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${view === 'stores' ? 'active' : ''}`}
          onClick={() => setView('stores')}
        >
          Stores
        </button>
      </div>

      {view === 'overview' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.totalUsers || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Stores</h3>
            <div className="stat-value">{stats.totalStores || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Ratings</h3>
            <div className="stat-value">{stats.totalRatings || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <div className="stat-value">{stats.adminCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Store Owners</h3>
            <div className="stat-value">{stats.ownerCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Regular Users</h3>
            <div className="stat-value">{stats.userCount || 0}</div>
          </div>
        </div>
      )}

      {view === 'users' && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} className="sortable">
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Address</th>
                  <th onClick={() => handleSort('role')} className="sortable">
                    Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedAndFilteredData(users).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No users found</td>
                  </tr>
                ) : (
                  getSortedAndFilteredData(users).map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'stores' && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search stores by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} className="sortable">
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Address</th>
                  <th>Owner ID</th>
                  <th onClick={() => handleSort('average_rating')} className="sortable">
                    Avg Rating {sortConfig.key === 'average_rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedAndFilteredData(stores, false).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No stores found</td>
                  </tr>
                ) : (
                  getSortedAndFilteredData(stores, false).map(store => (
                    <tr key={store.id}>
                      <td>{store.id}</td>
                      <td>{store.name}</td>
                      <td>{store.email}</td>
                      <td>{store.address}</td>
                      <td>{store.owner_id}</td>
                      <td>
                        {store.average_rating 
                          ? parseFloat(store.average_rating).toFixed(2) 
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>403</h1>
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this page.</p>
        <Link to="/" className="back-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Store Rating App</h1>
        <p className="home-description">
          Rate your favorite stores, discover new places, and help others make informed decisions.
        </p>
        
        <div className="features">
          <div className="feature-card">
            <h3>📊 Rate Stores</h3>
            <p>Share your experience by rating stores from 1 to 5 stars</p>
          </div>
          <div className="feature-card">
            <h3>🔍 Discover</h3>
            <p>Find the best-rated stores in your area</p>
          </div>
          <div className="feature-card">
            <h3>👥 Community</h3>
            <p>Join a community of users sharing authentic reviews</p>
          </div>
        </div>

        <div className="cta-buttons">
          <Link to="/signup" className="cta-button primary">
            Get Started
          </Link>
          <Link to="/login" className="cta-button secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

// Test script to verify backend API
// Run with: node test-api.js

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSignup() {
  console.log('Testing Signup API...\n');
  
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name: 'Test User Account For Testing',
      email: `test${Date.now()}@example.com`,
      password: 'Test@123',
      address: '123 Test Street, Test City, TS 12345',
      role: 'user'
    });
    
    console.log('✅ Signup successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Signup failed!');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\nTesting Login API...\n');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'user@example.com',
      password: 'User@123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    return response.data.token;
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testGetStores(token) {
  console.log('\nTesting Get Stores API...\n');
  
  try {
    const response = await axios.get(`${API_URL}/user/stores`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Get stores successful!');
    console.log('Stores found:', response.data.stores?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Get stores failed!');
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('Backend API Test Suite');
  console.log('='.repeat(50));
  
  // Test signup
  await testSignup();
  
  // Test login
  const token = await testLogin();
  
  // Test authenticated endpoint
  if (token) {
    await testGetStores(token);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Tests complete!');
  console.log('='.repeat(50));
}

// Run tests
runTests();

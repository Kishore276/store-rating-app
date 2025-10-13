========================================
STORE RATING APP - COMPLETE GUIDE
========================================

PROJECT STRUCTURE:
------------------
varun/
├── backend/              Node.js + Express API
├── frontend/             React Application
├── start-all.bat         Start both servers
├── start-backend.bat     Start backend only
├── start-frontend.bat    Start frontend only
└── README.txt            This file

========================================
QUICK START
========================================

OPTION 1 - Start Everything (EASIEST):
  Double-click: start-all.bat

OPTION 2 - Start Separately:
  1. Double-click: start-backend.bat
  2. Double-click: start-frontend.bat

OPTION 3 - Manual Start:
  Backend:
    cd backend
    npm start

  Frontend:
    cd frontend
    npm start

========================================
DEMO ACCOUNTS
========================================

After seeding the database, use these accounts:

Admin Account:
  Email: admin@example.com
  Password: Admin@123

User Account:
  Email: user@example.com
  Password: User@123

Owner Account:
  Email: owner@example.com
  Password: Owner@123

Alternative Accounts:
  user2@example.com / User@456
  owner2@example.com / Owner@456

========================================
CREATING NEW ACCOUNTS
========================================

Requirements for Signup:
  - Name: 20-60 characters, alphanumeric
  - Email: Valid email format
  - Password: 8-16 characters with:
    * At least one UPPERCASE letter
    * At least one special character (!@#$%^&*...)
  - Address: Optional, max 400 characters
  - Role: Choose admin, user, or owner

Valid Password Examples:
  Admin@123
  User@Pass1
  Owner$2024

Valid Name Examples:
  "Gunreddy Yuva kishore reddy"
  "Administrator User Account"
  "Store Owner Business Name"

========================================
TROUBLESHOOTING
========================================

Problem: Signup fails
Solution: 
  - Make sure name is 20-60 characters
  - Password must have uppercase AND special char
  - Check backend is running on port 5000
  - Open browser console (F12) to see error

Problem: "Cannot connect" error
Solution:
  - Make sure backend is running first
  - Backend should be on http://localhost:5000
  - Frontend should be on http://localhost:3000

Problem: Page won't load
Solution:
  - Clear browser cache
  - Check both servers are running
  - Restart both backend and frontend

Problem: Name too short error
Solution:
  - Name must be at least 20 characters
  - Add more words: "John Smith User Account"

========================================
PORTS & URLs
========================================

Backend API: http://localhost:5000
Frontend App: http://localhost:3000

API Endpoints:
  /api/auth/signup
  /api/auth/login
  /api/user/stores
  /api/admin/dashboard
  /api/owner/dashboard

========================================
DATABASE
========================================

Location: backend/database/store_rating.db

Seed Database with Demo Data:
  cd backend
  npm run seed

This creates:
  - 5 demo users (2 users, 2 owners, 1 admin)
  - 5 stores
  - 7 ratings

========================================
FEATURES BY ROLE
========================================

USER:
  ✓ View all stores
  ✓ Search stores
  ✓ Rate stores (1-5 stars)
  ✓ Update ratings
  ✓ See average ratings

ADMIN:
  ✓ View statistics
  ✓ Manage users
  ✓ View all stores
  ✓ Delete users
  ✓ Search & sort

OWNER:
  ✓ View owned stores
  ✓ See store ratings
  ✓ Track statistics
  ✓ Create new stores

========================================
TECH STACK
========================================

Backend:
  - Node.js
  - Express.js
  - SQLite database
  - JWT authentication
  - Bcrypt password hashing

Frontend:
  - React.js
  - React Router
  - Axios
  - Formik + Yup
  - React Rating

========================================
COMMON COMMANDS
========================================

Install Dependencies:
  cd backend && npm install
  cd frontend && npm install

Start Development:
  Backend: cd backend && npm start
  Frontend: cd frontend && npm start

Seed Database:
  cd backend && npm run seed

Build Frontend:
  cd frontend && npm run build

========================================
TIPS
========================================

1. Always start backend before frontend
2. Use demo accounts for testing
3. Name must be 20+ characters
4. Password needs uppercase + special char
5. Clear browser cache if issues persist
6. Check browser console for errors (F12)
7. Backend logs show incoming requests

========================================
SUPPORT
========================================

If signup still fails:
1. Open browser console (F12)
2. Check Network tab for error details
3. Verify backend is running
4. Try with demo account first
5. Make sure all fields meet requirements

Backend Logs:
  - Shows all incoming requests
  - Check terminal running backend
  - Look for error messages

========================================
PROJECT STATUS
========================================

✅ Backend - Fully functional
✅ Frontend - Fully functional
✅ Database - Initialized with demo data
✅ Authentication - Working
✅ All features - Implemented

Ready to use!

========================================

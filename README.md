# Store Rating App

A full-stack web application for rating and managing stores with role-based access control.

## Features

- **User Authentication**: Secure signup/login with JWT
- **Role-Based Access**: Admin, User, and Owner roles
- **Store Management**: View, search, and sort stores
- **Rating System**: Rate stores with 1-5 stars
- **Admin Dashboard**: Manage users and view statistics
- **Owner Dashboard**: Track your stores and their ratings

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Formik & Yup
- React Rating

### Backend
- Node.js & Express
- SQLite Database
- JWT Authentication
- bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd varun
```

2. Install dependencies for both frontend and backend
```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Start the backend server
```bash
cd backend
npm start
```

4. Start the frontend (in a new terminal)
```bash
cd frontend
npm start
```

5. Open http://localhost:3000 in your browser

## Demo Accounts

After seeding the database, use these accounts:

- **Admin**: admin@example.com / Admin@123
- **User**: user@example.com / User@123
- **Owner**: owner@example.com / Owner@123

## Seeding Database

To populate the database with demo data:

```bash
cd backend
npm run seed
```

## Deployment

### Frontend (GitHub Pages)
The frontend can be deployed to GitHub Pages. Build files are in the `frontend/build` directory.

### Backend
The backend requires a Node.js hosting service (Heroku, Render, Railway, etc.)

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/stores` - Get all stores
- `POST /api/user/ratings` - Rate a store
- `GET /api/admin/dashboard` - Admin statistics
- `GET /api/owner/dashboard` - Owner's stores

## License

MIT

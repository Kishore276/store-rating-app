# Deployment Guide - Store Rating App

## GitHub Pages Deployment (Frontend Only)

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub
2. Initialize git in your project (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 2: Update Frontend Configuration

1. Edit `frontend/package.json` and update the homepage:
```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME"
```

2. The app is already configured to use HashRouter for GitHub Pages compatibility

### Step 3: Deploy Frontend

From the root directory:

```bash
cd frontend
npm run deploy
```

This will:
- Build the production version
- Deploy to GitHub Pages
- Your app will be live at: https://YOUR-USERNAME.github.io/YOUR-REPO-NAME

### Step 4: Deploy Backend

GitHub Pages only hosts static files, so you need to deploy the backend separately.

#### Recommended Backend Hosting Options:

1. **Render** (Free tier available)
   - Sign up at render.com
   - Create new Web Service
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables (PORT, JWT_SECRET, etc.)

2. **Railway** (Free tier available)
   - Sign up at railway.app
   - Create new project
   - Deploy from GitHub
   - Set root directory to `backend`
   - Add environment variables

3. **Heroku**
   - Create a Heroku account
   - Install Heroku CLI
   - From backend folder:
   ```bash
   cd backend
   heroku create your-app-name
   git push heroku main
   ```

### Step 5: Update Frontend API URL

Once backend is deployed, update the frontend to use the production API:

1. Edit `frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

2. Rebuild and redeploy:
```bash
cd frontend
npm run deploy
```

## Important Notes

### CORS Configuration
Make sure your backend allows requests from your GitHub Pages URL. Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://YOUR-USERNAME.github.io'
  ],
  credentials: true
}));
```

### Database
- SQLite works for development but for production, consider using:
  - PostgreSQL (Render, Railway provide free instances)
  - MongoDB
  - MySQL

### Environment Variables
Never commit `.env` files. Set them in your hosting platform:
- `PORT` - Usually set automatically
- `JWT_SECRET` - Use a strong secret key
- `NODE_ENV` - Set to 'production'

## Testing Deployment

1. After deployment, visit your GitHub Pages URL
2. Test signup/login
3. Check browser console for errors
4. Verify API calls are reaching your backend

## Troubleshooting

### Issue: Blank page after deployment
- Check browser console for errors
- Verify homepage in package.json matches your GitHub Pages URL
- Ensure HashRouter is being used (not BrowserRouter)

### Issue: API calls failing
- Verify backend is running
- Check CORS configuration
- Ensure REACT_APP_API_URL is correct
- Check network tab in browser dev tools

### Issue: 404 on refresh
- This is normal with GitHub Pages and client-side routing
- HashRouter (#/) URLs work correctly
- Users can bookmark and share links

## Local Testing Before Deployment

1. Build the production version:
```bash
cd frontend
npm run build
```

2. Test the build locally:
```bash
npx serve -s build
```

3. Visit http://localhost:3000 to test

## Quick Deploy Script

Create `deploy.bat` in root:

```batch
@echo off
echo Deploying to GitHub Pages...
cd frontend
call npm run deploy
echo Deployment complete!
pause
```

Run it to deploy with one click!

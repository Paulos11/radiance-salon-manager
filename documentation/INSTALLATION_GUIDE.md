# INSTALLATION AND SETUP GUIDE

## Radiance Salon Manager

This guide provides detailed instructions for setting up and running the Radiance Salon Manager application.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-installation Checklist](#pre-installation-checklist)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 1. System Requirements

### Minimum Requirements

- **Operating System**: Windows 10, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 4 GB
- **Storage**: 1 GB free space
- **Processor**: Intel Core i3 or equivalent

### Software Requirements

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Git**: For version control (optional)
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

---

## 2. Pre-installation Checklist

Before starting the installation, ensure you have:

- [ ] Downloaded and installed Node.js from [nodejs.org](https://nodejs.org)
- [ ] Verified Node.js installation: `node --version`
- [ ] Verified npm installation: `npm --version`
- [ ] Downloaded the project source code
- [ ] A text editor or IDE (VS Code recommended)

---

## 3. Installation Steps

### Step 1: Extract Project Files

1. Extract the project archive to your desired location
2. Open terminal/command prompt
3. Navigate to the project directory:
   ```bash
   cd path/to/radiance-salon-manager
   ```

### Step 2: Backend Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

   This will install:
   - express
   - sqlite3
   - bcryptjs
   - jsonwebtoken
   - cors
   - dotenv
   - express-validator
   - morgan

3. Wait for installation to complete (may take 2-5 minutes)

### Step 3: Frontend Installation

1. Open a new terminal window
2. Navigate to the frontend directory:
   ```bash
   cd path/to/radiance-salon-manager/frontend
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

   This will install:
   - react
   - react-dom
   - react-router-dom
   - axios
   - react-toastify
   - date-fns

4. Wait for installation to complete (may take 3-7 minutes)

---

## 4. Configuration

### Backend Configuration

1. In the backend directory, you'll find a `.env` file
2. Open `.env` in a text editor
3. Configure the following variables:

   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=radiance_salon_secret_key_2024_change_in_production
   JWT_EXPIRE=7d
   DATABASE_PATH=../database/radiance_salon.db
   ```

4. **Important**: Change `JWT_SECRET` to a strong, random string for production

### Frontend Configuration

1. In the frontend directory, you'll find a `.env` file
2. Open `.env` in a text editor
3. Configure:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. If your backend runs on a different port, update accordingly

---

## 5. Database Setup

### Step 1: Create Database Directory

```bash
# From project root
mkdir -p database
```

### Step 2: Run Migrations

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Run the migration script:
   ```bash
   npm run migrate
   ```

3. You should see output confirming table creation:
   ```
   Connected to SQLite database successfully
   All tables created successfully
   Default data seeded successfully
   Database migration completed successfully
   ```

### Step 3: Verify Database

The database file will be created at: `database/radiance_salon.db`

**Default Sample Data Included:**
- 8 sample services (Haircut, Facial, Manicure, etc.)
- Business hours (Mon-Sat: 9 AM - 7 PM, Sun: 9 AM - 8 PM)

---

## 6. Running the Application

### Development Mode

#### Starting the Backend

1. Open terminal in backend directory
2. Run:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   Database connected successfully
   Radiance Salon Manager API running on port 5000
   Environment: development
   ```

#### Starting the Frontend

1. Open a new terminal in frontend directory
2. Run:
   ```bash
   npm start
   ```

3. The application will automatically open in your browser at `http://localhost:3000`

4. If it doesn't open automatically, navigate to `http://localhost:3000`

### Production Mode

#### Backend Production Build

```bash
cd backend
npm start
```

#### Frontend Production Build

```bash
cd frontend
npm run build
```

The build folder will contain optimized production files.

---

## 7. Testing

### Backend Tests

```bash
cd backend
npm test
```

Expected output:
```
Test Suites: 2 passed, 2 total
Tests: 6 passed, 6 total
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 8. First Time Setup

### Creating Admin Account

1. Register a new account through the web interface
2. Note the user ID from the registration
3. Access the database and update the user role:

   Using SQLite CLI:
   ```bash
   sqlite3 database/radiance_salon.db
   ```

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   .quit
   ```

### Adding Staff Members

1. Login as admin
2. Navigate to Admin Panel → Staff
3. Click "Add Staff Member"
4. Fill in staff details and save

### Adding More Services

1. Login as admin
2. Navigate to Admin Panel → Services
3. Click "Add Service"
4. Enter service details and save

---

## 9. Deployment

### Option 1: Traditional Hosting

#### Backend Deployment

1. Set environment to production:
   ```env
   NODE_ENV=production
   ```

2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name radiance-backend
   ```

#### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve the build folder using:
   - Apache
   - Nginx
   - Express static server

### Option 2: Cloud Deployment

#### Backend (Heroku, DigitalOcean, AWS)

1. Push code to repository
2. Configure environment variables on hosting platform
3. Set build command: `npm install`
4. Set start command: `npm start`

#### Frontend (Netlify, Vercel, AWS S3)

1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

---

## 10. Troubleshooting

### Backend Issues

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` file

#### Database Connection Error
```
Database connection error
```
**Solutions**:
1. Verify database file exists
2. Check DATABASE_PATH in `.env`
3. Run migrations again: `npm run migrate`

#### Module Not Found Error
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in backend directory

### Frontend Issues

#### Cannot Connect to API
```
Network Error or CORS error
```
**Solutions**:
1. Verify backend is running
2. Check REACT_APP_API_URL in `.env`
3. Ensure backend PORT matches

#### Build Errors
```
npm ERR! code ELIFECYCLE
```
**Solutions**:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

#### Port 3000 Already in Use
**Solution**:
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Database Issues

#### Tables Not Created
**Solution**: Manually run migration:
```bash
cd backend
node src/config/migrate.js
```

#### Database Locked
**Solution**: Close all connections to database and restart

---

## Post-Installation Checklist

- [ ] Backend server running successfully
- [ ] Frontend application accessible in browser
- [ ] Database created with sample data
- [ ] Admin account created
- [ ] Sample services visible
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can browse services
- [ ] Can book appointment (as customer)

---

## Support

If you encounter issues not covered in this guide:

1. Check the error logs in:
   - Backend: Terminal running backend
   - Frontend: Browser console (F12)

2. Contact support:
   - Email: support@radiancesalon.com
   - Documentation: Check README.md

---

## Maintenance

### Regular Tasks

1. **Database Backup**:
   ```bash
   cp database/radiance_salon.db database/backup/salon_$(date +%Y%m%d).db
   ```

2. **Update Dependencies**:
   ```bash
   npm update
   ```

3. **Clear Logs** (if implemented):
   ```bash
   rm logs/*.log
   ```

---

## Security Recommendations

1. **Change Default JWT Secret**: Update JWT_SECRET in production
2. **Use HTTPS**: Configure SSL certificate for production
3. **Regular Updates**: Keep dependencies updated
4. **Database Backup**: Implement regular backup schedule
5. **Access Control**: Limit database file permissions
6. **Environment Variables**: Never commit .env files to version control

---

**Installation Complete!**

You should now have a fully functional Radiance Salon Manager system running locally.

For production deployment, follow the deployment section and security recommendations.

---

*Document Version: 1.0*
*Last Updated: 2024*

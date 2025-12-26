# QUICK START GUIDE

## Radiance Salon Manager

Get up and running in 5 minutes!

---

## Prerequisites

Ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

Check versions:
```bash
node --version
npm --version
```

---

## Installation

### 1. Navigate to Project

```bash
cd radiance-salon-manager
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Setup Database

```bash
cd ../backend
npm run migrate
```

You should see: "Database migration completed successfully"

---

## Running the Application

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Wait for: "Radiance Salon Manager API running on port 5000"

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

---

## First Steps

### 1. Create Account
- Click "Register" in navigation
- Fill in your details
- Click "Create Account"

### 2. Browse Services
- Click "Services" in navigation
- View available services
- Filter by category

### 3. Book Appointment
- Select a service
- Click "Book Now"
- Choose date, time, and staff
- Confirm booking

---

## Default Data

The system comes with 8 sample services:

| Service | Category | Price | Duration |
|---------|----------|-------|----------|
| Haircut & Styling | Hair | ₹500 | 45 min |
| Hair Coloring | Hair | ₹2000 | 120 min |
| Facial Treatment | Skin | ₹1200 | 60 min |
| Manicure | Nails | ₹400 | 30 min |
| Pedicure | Nails | ₹600 | 45 min |
| Bridal Makeup | Makeup | ₹5000 | 180 min |
| Hair Spa | Hair | ₹1500 | 90 min |
| Waxing (Full Body) | Body | ₹1800 | 90 min |

---

## Creating Admin Account

After registration, make yourself admin:

```bash
# Access database
sqlite3 database/radiance_salon.db

# Update your user role
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# Exit
.quit
```

Re-login to see admin features.

---

## Admin Features

As admin, you can:
- Manage Services (Add, Edit, Delete)
- Manage Staff Members
- View All Appointments
- Assign Services to Staff

---

## Troubleshooting

### Port Already in Use

**Backend (Port 5000)**
```bash
# Change PORT in backend/.env
PORT=5001
```

**Frontend (Port 3000)**
```bash
# The system will ask to use another port
# Press Y to continue
```

### Database Not Found

```bash
cd backend
npm run migrate
```

### Module Not Found

```bash
# In backend or frontend directory
rm -rf node_modules
npm install
```

---

## Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

---

## Project Structure

```
radiance-salon-manager/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   └── tests/           # Backend tests
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   └── App.js       # Main app
│   └── public/          # Static files
│
├── database/            # SQLite database
│
└── documentation/       # Full documentation
```

---

## Next Steps

1. **Explore the Documentation**
   - `README.md` - Project overview
   - `documentation/USER_MANUAL.md` - User guide
   - `documentation/INSTALLATION_GUIDE.md` - Detailed setup
   - `documentation/TECHNICAL_DOCUMENTATION.md` - Technical details

2. **Customize the System**
   - Add your own services
   - Update business hours
   - Customize colors in `frontend/src/styles/colors.css`

3. **Add Staff Members**
   - Login as admin
   - Navigate to Admin Panel → Staff
   - Add staff with credentials

---

## Support

Need help?
- Check `documentation/` folder for detailed guides
- Review `README.md` for API documentation
- Check troubleshooting section

---

## Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api

---

**That's it! You're ready to use Radiance Salon Manager.**

Happy booking! 💇✨

---

*For detailed information, refer to the complete documentation in the `documentation/` folder.*

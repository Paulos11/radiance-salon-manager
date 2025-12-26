# PROJECT FILE STRUCTURE

## Radiance Salon Manager - Complete File Listing

---

## Directory Overview

```
radiance-salon-manager/
├── backend/                    # Backend API Server
├── frontend/                   # React Frontend Application
├── database/                   # SQLite Database Files
├── documentation/              # Project Documentation
├── README.md                   # Main project documentation
├── PROJECT_SUMMARY.md          # Project overview and summary
├── QUICK_START.md             # Quick setup guide
├── FILE_STRUCTURE.md          # This file
└── .gitignore                 # Git ignore rules
```

---

## Backend Structure

### /backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js              # Database connection and methods
│   │   └── migrate.js               # Database migration script
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication handlers
│   │   ├── serviceController.js     # Service CRUD handlers
│   │   ├── appointmentController.js # Appointment management
│   │   └── staffController.js       # Staff management
│   │
│   ├── models/
│   │   ├── User.js                  # User model
│   │   ├── Customer.js              # Customer model
│   │   ├── Staff.js                 # Staff model
│   │   ├── Service.js               # Service model
│   │   └── Appointment.js           # Appointment model
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Auth API routes
│   │   ├── serviceRoutes.js         # Service API routes
│   │   ├── appointmentRoutes.js     # Appointment API routes
│   │   └── staffRoutes.js           # Staff API routes
│   │
│   ├── middleware/
│   │   ├── auth.js                  # Auth & authorization middleware
│   │   ├── errorHandler.js          # Error handling middleware
│   │   └── validator.js             # Validation middleware
│   │
│   ├── utils/
│   │   └── generateToken.js         # JWT token generation
│   │
│   └── server.js                    # Main server entry point
│
├── tests/
│   ├── auth.test.js                 # Authentication tests
│   └── services.test.js             # Services API tests
│
├── package.json                     # Backend dependencies
├── .env                            # Environment variables
└── .env.example                    # Example environment file
```

### Backend Files Description

#### Configuration Files
- **database.js**: Database connection class with promise-based methods (connect, run, get, all, close)
- **migrate.js**: Creates all database tables and seeds initial data (services, business hours)

#### Controllers (Business Logic)
- **authController.js**: Handles registration, login, profile management, password changes
- **serviceController.js**: CRUD operations for services, category management
- **appointmentController.js**: Appointment booking, updates, cancellations, availability checking
- **staffController.js**: Staff management, service assignments

#### Models (Data Access Layer)
- **User.js**: User CRUD, password validation, authentication
- **Customer.js**: Customer profile management
- **Staff.js**: Staff profile, service assignments, availability
- **Service.js**: Service CRUD, category filtering
- **Appointment.js**: Booking management, conflict detection

#### Routes (API Endpoints)
- **authRoutes.js**: POST /register, /login, GET/PUT /profile
- **serviceRoutes.js**: GET/POST/PUT/DELETE /services
- **appointmentRoutes.js**: GET/POST/PUT/DELETE /appointments
- **staffRoutes.js**: GET/POST/PUT/DELETE /staff

#### Middleware
- **auth.js**: JWT verification, role-based authorization
- **errorHandler.js**: Centralized error handling
- **validator.js**: Input validation wrapper

---

## Frontend Structure

### /frontend

```
frontend/
├── public/
│   └── index.html                   # HTML template
│
├── src/
│   ├── components/
│   │   ├── Navbar.js               # Navigation component
│   │   ├── Navbar.css
│   │   ├── Footer.js               # Footer component
│   │   ├── Footer.css
│   │   ├── ServiceCard.js          # Service display card
│   │   ├── ServiceCard.css
│   │   ├── AppointmentCard.js      # Appointment display card
│   │   └── AppointmentCard.css
│   │
│   ├── pages/
│   │   ├── Home.js                 # Landing page
│   │   ├── Home.css
│   │   ├── Login.js                # Login page
│   │   ├── Register.js             # Registration page
│   │   ├── Auth.css                # Auth pages styles
│   │   ├── Services.js             # Services listing page
│   │   ├── Services.css
│   │   ├── Appointments.js         # Appointments management page
│   │   ├── Appointments.css
│   │   ├── Dashboard.js            # User dashboard
│   │   └── Dashboard.css
│   │
│   ├── context/
│   │   └── AuthContext.js          # Authentication context & provider
│   │
│   ├── utils/
│   │   └── api.js                  # API client configuration
│   │
│   ├── styles/
│   │   ├── colors.css              # Color scheme variables
│   │   └── App.css                 # Global styles
│   │
│   ├── App.js                      # Main app component
│   └── index.js                    # React entry point
│
├── package.json                     # Frontend dependencies
└── .env                            # Environment variables
```

### Frontend Files Description

#### Components (Reusable)
- **Navbar.js**: Top navigation bar with authentication-aware menu
- **Footer.js**: Site footer with links and contact info
- **ServiceCard.js**: Displays service details with booking button
- **AppointmentCard.js**: Shows appointment details with actions

#### Pages (Routes)
- **Home.js**: Landing page with hero section and features
- **Login.js**: User login form
- **Register.js**: User registration form
- **Services.js**: Service catalog with category filtering
- **Appointments.js**: User's appointments with status filtering
- **Dashboard.js**: Overview dashboard with stats and quick actions

#### Context
- **AuthContext.js**: Global authentication state, login/logout/register functions

#### Utils
- **api.js**: Axios instance configuration, API helper functions

#### Styles
- **colors.css**: CSS custom properties for color scheme
- **App.css**: Global styles, utility classes, component base styles

---

## Database Structure

### /database

```
database/
└── radiance_salon.db               # SQLite database file
```

### Database Tables

1. **users** - User accounts (id, full_name, email, password_hash, phone, role, is_active)
2. **customers** - Customer profiles (id, user_id, date_of_birth, address, preferences)
3. **staff** - Staff profiles (id, user_id, specialization, experience_years, bio)
4. **services** - Available services (id, service_name, description, duration, price, category)
5. **appointments** - Bookings (id, customer_id, staff_id, service_id, date, time, status)
6. **staff_services** - Staff-service mapping (id, staff_id, service_id)
7. **business_hours** - Operating hours (id, day_of_week, open_time, close_time)
8. **reviews** - Customer reviews (id, appointment_id, rating, review_text)
9. **payments** - Payment records (id, appointment_id, amount, status)

---

## Documentation Structure

### /documentation

```
documentation/
├── PROJECT_SYNOPSIS.md             # Academic project synopsis
├── USER_MANUAL.md                  # Complete user guide
├── INSTALLATION_GUIDE.md           # Detailed setup instructions
└── TECHNICAL_DOCUMENTATION.md      # Technical specifications
```

### Documentation Files Description

- **PROJECT_SYNOPSIS.md**: Problem statement, objectives, methodology (for university submission)
- **USER_MANUAL.md**: Step-by-step user guide for all roles
- **INSTALLATION_GUIDE.md**: Complete installation and deployment guide
- **TECHNICAL_DOCUMENTATION.md**: Architecture, ERD, DFD, API docs, testing

---

## Root Level Files

### Main Documentation

- **README.md**: Project overview, features, setup instructions, API reference
- **PROJECT_SUMMARY.md**: Executive summary, achievements, metrics
- **QUICK_START.md**: 5-minute setup guide
- **FILE_STRUCTURE.md**: This file - complete file listing

### Configuration

- **.gitignore**: Git ignore rules (node_modules, .env, database files, etc.)

---

## File Count Summary

| Category | Count |
|----------|-------|
| **Backend JavaScript Files** | 18 |
| **Frontend JavaScript Files** | 17 |
| **Frontend CSS Files** | 10 |
| **Test Files** | 2 |
| **Documentation Files** | 8 |
| **Configuration Files** | 5 |
| **Total** | **60+** |

---

## Key File Purposes

### Critical Backend Files

1. **server.js**: Application entry point, middleware setup, route mounting
2. **database.js**: Database abstraction layer
3. **migrate.js**: Database schema creation
4. **authController.js**: User authentication logic
5. **auth.js (middleware)**: Request authentication and authorization

### Critical Frontend Files

1. **App.js**: Main application component, routing setup
2. **AuthContext.js**: Global authentication state management
3. **api.js**: API communication configuration
4. **Navbar.js**: Primary navigation component
5. **Dashboard.js**: Main user interface after login

### Must-Read Documentation

1. **QUICK_START.md**: For immediate setup
2. **README.md**: For project overview
3. **USER_MANUAL.md**: For using the application
4. **TECHNICAL_DOCUMENTATION.md**: For understanding architecture

---

## File Dependencies

### Backend Dependency Chain

```
server.js
  └── routes/*.js
      └── controllers/*.js
          └── models/*.js
              └── database.js
```

### Frontend Component Hierarchy

```
App.js
  └── AuthProvider (AuthContext.js)
      ├── Navbar.js
      ├── Pages/*.js
      │   └── Components/*.js
      └── Footer.js
```

---

## Environment Files

### Backend .env
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
DATABASE_PATH=../database/radiance_salon.db
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Build Output (Not in Repository)

### Backend
```
node_modules/          # NPM dependencies
logs/                  # Application logs (if configured)
```

### Frontend
```
node_modules/          # NPM dependencies
build/                 # Production build output
```

### Database
```
database/*.db          # SQLite database files
database/*.db-journal  # SQLite journal files
```

---

## File Naming Conventions

### Backend
- **Controllers**: `{entity}Controller.js` (e.g., authController.js)
- **Models**: `{Entity}.js` (e.g., User.js, capitalized)
- **Routes**: `{entity}Routes.js` (e.g., authRoutes.js)
- **Middleware**: `{purpose}.js` (e.g., auth.js, errorHandler.js)

### Frontend
- **Components**: `{ComponentName}.js` (e.g., Navbar.js, PascalCase)
- **Pages**: `{PageName}.js` (e.g., Dashboard.js, PascalCase)
- **Styles**: `{ComponentName}.css` (matching component name)
- **Utils**: `{purpose}.js` (e.g., api.js, lowercase)

---

## Important File Relationships

### Authentication Flow
```
Login.js (frontend)
  → api.js
  → authRoutes.js (backend)
  → authController.js
  → User.js (model)
  → database.js
```

### Appointment Booking Flow
```
Services.js (frontend)
  → api.js
  → appointmentRoutes.js (backend)
  → appointmentController.js
  → Appointment.js (model)
  → database.js
```

---

## Testing Files

### Backend Tests
- **auth.test.js**: Tests for registration, login, authentication
- **services.test.js**: Tests for service CRUD operations

### Test Coverage
- Authentication: 6 tests
- Services: 5 tests
- Total: 11+ tests

---

## Documentation Standards

All JavaScript files include:
- Descriptive function names
- Clear variable names
- Logical code organization
- Separation of concerns

Documentation files follow:
- Markdown formatting
- Clear section headers
- Code examples
- Step-by-step instructions

---

**Total Project Size**: ~8,000+ lines of code (excluding node_modules)

**Last Updated**: 2024

---

*For detailed information about any file, refer to the inline comments within the file or the relevant documentation.*

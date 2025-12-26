# Radiance Salon Manager

A comprehensive beauty salon booking and management system built with modern web technologies.

## Project Overview

Radiance Salon Manager is a full-stack web application designed to streamline salon operations, enabling customers to easily book appointments and salon administrators to efficiently manage services, staff, and bookings.

## Features

### Customer Features
- User registration and authentication
- Browse available services by category
- Book appointments with preferred staff
- View appointment history
- Manage upcoming appointments
- Update profile information

### Admin Features
- Manage services (create, update, delete)
- Manage staff members
- View all appointments
- Assign services to staff
- Track salon statistics

### Staff Features
- View assigned appointments
- Update availability status
- Manage profile information

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Database (local file-based)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Date-fns** - Date formatting

### Design
- **Custom CSS** - Styling
- **Color Scheme**:
  - Primary: Teal (#0D9488)
  - Secondary: Rose Gold (#E8A09A)
  - Accent: Coral (#FF6B6B)
  - Background: Ivory (#FFFBF5)

## Project Structure

```
radiance-salon-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── tests/              # Test files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # CSS files
│   │   └── App.js          # Main app component
│   └── package.json
├── database/               # SQLite database files
├── documentation/          # Project documentation
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
DATABASE_PATH=./database/radiance_salon.db
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin only)
- `PUT /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)
- `GET /api/services/categories` - Get all categories

### Appointments
- `GET /api/appointments` - Get appointments (filtered by role)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment (Admin only)
- `GET /api/appointments/upcoming` - Get upcoming appointments

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create staff (Admin only)
- `PUT /api/staff/:id` - Update staff (Admin only)
- `DELETE /api/staff/:id` - Delete staff (Admin only)
- `GET /api/staff/:id/services` - Get staff services
- `POST /api/staff/:id/services` - Add service to staff (Admin only)

## Database Schema

The application uses SQLite with the following main tables:

- **users** - User accounts (customers, staff, admin)
- **customers** - Customer-specific information
- **staff** - Staff member profiles
- **services** - Available salon services
- **appointments** - Booking records
- **staff_services** - Many-to-many relationship
- **business_hours** - Salon operating hours
- **reviews** - Customer reviews
- **payments** - Payment records

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Default Sample Data

The system comes with pre-seeded sample services:
- Haircut & Styling (₹500)
- Hair Coloring (₹2000)
- Facial Treatment (₹1200)
- Manicure (₹400)
- Pedicure (₹600)
- Bridal Makeup (₹5000)
- Hair Spa (₹1500)
- Waxing Full Body (₹1800)

## User Roles

1. **Customer** - Can book appointments, view services, manage profile
2. **Staff** - Can view their appointments, update availability
3. **Admin** - Full access to manage services, staff, and appointments

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Role-based access control
- Input validation
- SQL injection prevention

## Future Enhancements

- Email notifications
- SMS reminders
- Payment gateway integration
- Review and rating system
- Advanced reporting and analytics
- Mobile application
- Multi-language support

## Contributors

This project was developed as an academic project.

## License

This project is developed for educational purposes.

## Contact

For any queries or support, please contact:
- Email: info@radiancesalon.com
- Phone: +1 234 567 8900
# radiance-salon-manager

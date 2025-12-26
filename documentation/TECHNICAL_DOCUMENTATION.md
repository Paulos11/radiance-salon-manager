# TECHNICAL DOCUMENTATION

## Radiance Salon Manager

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [API Documentation](#api-documentation)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [Testing Methodology](#testing-methodology)
7. [Security Implementation](#security-implementation)
8. [Performance Optimization](#performance-optimization)

---

## 1. System Architecture

### 1.1 Architecture Overview

The application follows a **Three-Tier Architecture**:

```
┌─────────────────────────────────────┐
│     Presentation Layer (Frontend)   │
│         React Application           │
└─────────────┬───────────────────────┘
              │ HTTP/HTTPS (REST API)
              │
┌─────────────┴───────────────────────┐
│     Application Layer (Backend)     │
│   Node.js + Express.js Server       │
└─────────────┬───────────────────────┘
              │ SQL Queries
              │
┌─────────────┴───────────────────────┐
│      Data Layer (Database)          │
│          SQLite Database            │
└─────────────────────────────────────┘
```

### 1.2 Component Description

#### Frontend (Presentation Layer)
- **Technology**: React 18.2
- **Responsibilities**:
  - User interface rendering
  - User input handling
  - Client-side routing
  - State management
  - API communication

#### Backend (Application Layer)
- **Technology**: Node.js with Express.js
- **Responsibilities**:
  - Business logic execution
  - Request/Response handling
  - Authentication & Authorization
  - Data validation
  - Database operations

#### Database (Data Layer)
- **Technology**: SQLite3
- **Responsibilities**:
  - Data persistence
  - Data integrity
  - Transaction management
  - Query execution

### 1.3 Design Patterns Used

1. **MVC (Model-View-Controller)**
   - Models: Database interaction layer
   - Views: React components
   - Controllers: Request handlers

2. **Repository Pattern**
   - Models act as repositories for data access

3. **Middleware Pattern**
   - Authentication middleware
   - Error handling middleware
   - Validation middleware

---

## 2. Database Design

### 2.1 Entity Relationship Diagram (ERD)

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  Users   │────────▶│  Customers   │         │   Staff  │
│          │         │              │         │          │
│ id       │         │ id           │         │ id       │
│ email    │         │ user_id (FK) │         │ user_id  │
│ password │         │ dob          │         │ special. │
│ role     │         │ address      │         │ exp_yrs  │
└────┬─────┘         └──────┬───────┘         └────┬─────┘
     │                      │                      │
     │                      │                      │
     │                      │                      │
     │                      ▼                      │
     │              ┌──────────────┐               │
     │              │ Appointments │◀──────────────┘
     │              │              │
     │              │ id           │
     │              │ customer_id  │
     │              │ staff_id     │
     │              │ service_id   │
     │              │ date         │
     │              │ time         │
     │              │ status       │
     │              └──────┬───────┘
     │                     │
     │                     ▼
     │              ┌──────────────┐
     └──────────────│   Services   │
                    │              │
                    │ id           │
                    │ name         │
                    │ category     │
                    │ price        │
                    │ duration     │
                    └──────────────┘
```

### 2.2 Database Tables

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT CHECK(role IN ('admin', 'staff', 'customer')),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Customers Table
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date_of_birth DATE,
    address TEXT,
    preferences TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Staff Table
```sql
CREATE TABLE staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    specialization TEXT,
    experience_years INTEGER,
    bio TEXT,
    is_available INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Services Table
```sql
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointments Table
```sql
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```

### 2.3 Data Dictionary

| Table | Column | Type | Description | Constraints |
|-------|--------|------|-------------|-------------|
| users | id | INTEGER | Unique identifier | PRIMARY KEY |
| users | full_name | TEXT | User's full name | NOT NULL |
| users | email | TEXT | Email address | UNIQUE, NOT NULL |
| users | password_hash | TEXT | Hashed password | NOT NULL |
| users | role | TEXT | User role | CHECK IN list |
| customers | user_id | INTEGER | Reference to user | FOREIGN KEY |
| services | price | DECIMAL | Service price | NOT NULL, ≥ 0 |
| appointments | status | TEXT | Appointment status | CHECK IN list |

---

## 3. API Documentation

### 3.1 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { "id": 1, "full_name": "John Doe", ... },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### 3.2 Services Endpoints

#### Get All Services
```http
GET /api/services

Response: 200 OK
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "service_name": "Haircut & Styling",
      "price": 500,
      "duration_minutes": 45,
      ...
    }
  ]
}
```

#### Create Service (Admin only)
```http
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "service_name": "New Service",
  "description": "Description",
  "duration_minutes": 60,
  "price": 1000,
  "category": "Hair"
}
```

### 3.3 Appointments Endpoints

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer {token}

{
  "service_id": 1,
  "staff_id": 2,
  "appointment_date": "2024-12-30",
  "appointment_time": "14:00:00",
  "notes": "First time customer"
}
```

---

## 4. Data Flow Diagrams

### 4.1 Level 0 DFD (Context Diagram)

```
                    ┌────────────────┐
                    │                │
      Customer ────▶│   Radiance     │◀──── Admin
                    │     Salon      │
                    │    Manager     │
      Staff    ────▶│                │◀──── Database
                    │                │
                    └────────────────┘
```

### 4.2 Level 1 DFD

```
┌──────────┐         ┌──────────────────┐         ┌──────────┐
│          │ Login/  │                  │ Service │          │
│ Customer │────────▶│  Authentication  │────────▶│ Services │
│          │ Register│      System      │  Data   │   DB     │
└────┬─────┘         └──────────────────┘         └──────────┘
     │                                                   │
     │ Book                                             │
     │ Appointment        ┌──────────────────┐          │
     └───────────────────▶│   Appointment    │◀─────────┘
                          │    Management    │
                          └──────────────────┘
                                   │
                                   │ Store
                                   ▼
                          ┌──────────────────┐
                          │   Appointments   │
                          │       DB         │
                          └──────────────────┘
```

### 4.3 Appointment Booking Flow

```
Customer                Frontend                Backend               Database
   │                       │                       │                     │
   │  Browse Services      │                       │                     │
   ├──────────────────────▶│                       │                     │
   │                       │  GET /api/services    │                     │
   │                       ├──────────────────────▶│                     │
   │                       │                       │  SELECT * FROM      │
   │                       │                       │  services           │
   │                       │                       ├────────────────────▶│
   │                       │                       │◀────────────────────┤
   │                       │◀──────────────────────┤                     │
   │◀──────────────────────┤                       │                     │
   │                       │                       │                     │
   │  Select Service       │                       │                     │
   │  & Book              │                       │                     │
   ├──────────────────────▶│                       │                     │
   │                       │ POST /api/appointments│                     │
   │                       ├──────────────────────▶│                     │
   │                       │                       │  Validate Data      │
   │                       │                       │  Check Availability │
   │                       │                       ├────────────────────▶│
   │                       │                       │  INSERT             │
   │                       │                       │  appointment        │
   │                       │                       │◀────────────────────┤
   │                       │◀──────────────────────┤                     │
   │◀──────────────────────┤                       │                     │
   │  Confirmation         │                       │                     │
```

---

## 5. Testing Methodology

### 5.1 Testing Levels

#### Unit Testing
- **Framework**: Jest
- **Coverage**: Individual functions and components
- **Examples**:
  - Model methods (create, read, update, delete)
  - Utility functions
  - React components

```javascript
// Example: User Model Test
describe('User Model', () => {
  test('should create a new user', async () => {
    const userData = {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    };
    const userId = await User.create(userData);
    expect(userId).toBeDefined();
  });
});
```

#### Integration Testing
- **Framework**: Supertest + Jest
- **Coverage**: API endpoints
- **Examples**:
  - Authentication flow
  - Service CRUD operations
  - Appointment booking

```javascript
// Example: API Integration Test
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

#### System Testing
- **Type**: End-to-End Testing
- **Coverage**: Complete user workflows
- **Scenarios**:
  - User registration → Login → Browse services → Book appointment
  - Admin creates service → Assigns to staff → Approves booking

### 5.2 Test Cases

#### Authentication Tests

| Test ID | Description | Input | Expected Output | Status |
|---------|-------------|-------|-----------------|--------|
| AUTH-01 | Register new user | Valid user data | 201, user created | Pass |
| AUTH-02 | Duplicate email | Existing email | 400, error message | Pass |
| AUTH-03 | Login valid | Correct credentials | 200, JWT token | Pass |
| AUTH-04 | Login invalid | Wrong password | 401, error | Pass |
| AUTH-05 | Password < 6 chars | Short password | 400, validation error | Pass |

#### Appointment Tests

| Test ID | Description | Input | Expected Output | Status |
|---------|-------------|-------|-----------------|--------|
| APT-01 | Create appointment | Valid data | 201, appointment created | Pass |
| APT-02 | Double booking | Same time slot | 400, conflict error | Pass |
| APT-03 | Get appointments | Customer ID | 200, list of appointments | Pass |
| APT-04 | Cancel appointment | Appointment ID | 200, status updated | Pass |
| APT-05 | Past date booking | Old date | 400, validation error | Pass |

### 5.3 Testing Report Template

```
Test Report
-----------
Project: Radiance Salon Manager
Date: [Test Date]
Tester: [Name]
Environment: Development

Summary:
- Total Tests: 25
- Passed: 23
- Failed: 2
- Success Rate: 92%

Failed Tests:
1. APT-06: Reschedule appointment - Fixed
2. SRV-03: Update service price - Fixed

Recommendations:
- Add more edge case tests
- Implement automated testing in CI/CD
```

---

## 6. Security Implementation

### 6.1 Authentication

- **Method**: JWT (JSON Web Tokens)
- **Storage**: LocalStorage (frontend)
- **Expiration**: 7 days (configurable)
- **Token Structure**:
  ```json
  {
    "id": 1,
    "iat": 1640000000,
    "exp": 1640604800
  }
  ```

### 6.2 Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Never store plain passwords
- **Validation**: Minimum 6 characters

### 6.3 Authorization

- **Method**: Role-Based Access Control (RBAC)
- **Roles**: admin, staff, customer
- **Implementation**: Middleware checks

```javascript
// Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    next();
  };
};
```

### 6.4 Input Validation

- **Library**: express-validator
- **Validation Points**:
  - Email format
  - Required fields
  - Data types
  - Length constraints

### 6.5 SQL Injection Prevention

- **Method**: Parameterized queries
- **Example**:
  ```javascript
  // Safe
  database.get('SELECT * FROM users WHERE email = ?', [email]);

  // Unsafe (NOT used)
  database.get(`SELECT * FROM users WHERE email = '${email}'`);
  ```

### 6.6 CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 7. Performance Optimization

### 7.1 Database Optimization

- **Indexes**: Created on frequently queried columns
  - users.email
  - appointments.appointment_date
  - appointments.staff_id

- **Query Optimization**: Use SELECT specific columns instead of *

### 7.2 Frontend Optimization

- **Code Splitting**: Lazy loading of routes
- **Memoization**: React.memo for components
- **Asset Optimization**: Compressed images and CSS

### 7.3 Caching Strategy

- **Frontend**: Service data cached in state
- **Backend**: Consider Redis for production

---

## 8. Error Handling

### 8.1 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### 8.2 HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Authorization failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server errors |

---

## Appendix

### A. Color Scheme

```css
Primary: #0D9488 (Teal)
Secondary: #E8A09A (Rose Gold)
Accent: #FF6B6B (Coral)
Background: #FFFBF5 (Ivory)
Text: #2D3436 (Charcoal)
```

### B. Dependencies

**Backend:**
- express: ^4.18.2
- sqlite3: ^5.1.6
- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.0.2
- cors: ^2.8.5

**Frontend:**
- react: ^18.2.0
- react-router-dom: ^6.18.0
- axios: ^1.6.0
- react-toastify: ^9.1.3

---

*Document Version: 1.0*
*Last Updated: 2024*

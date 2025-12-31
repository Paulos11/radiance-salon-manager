# MAIN PROJECT REPORT

## 1. THEORETICAL BACKGROUND
The **Radiance Salon Manager** is built on the **MERN Stack** (MongoDB/SQLite, Express, React, Node.js) philosophy, adapted here to use **SQLite** for lighter-weight deployment.

*   **React (Frontend):** A component-based JavaScript library for building user interfaces. It allows for single-page applications (SPAs) where content updates dynamically without reloading the page.
*   **Node.js (Runtime):** A JavaScript runtime built on Chrome's V8 engine, enabling server-side scripting.
*   **Express.js (Backend Framework):** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
*   **SQLite (Database):** A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
*   **Tailwind CSS (Styling):** A utility-first CSS framework for rapidly building custom user interfaces.

## 2. SYSTEM ANALYSIS
### 2.1 Existing System
The existing system relies on manual bookkeeping or disparate tools (e.g., Google Calendar + Excel).
*   **Drawbacks:**
    *   Time-consuming manual entry.
    *   High probability of human error (e.g., double bookings).
    *   No consolidated view of business performance.
    *   Customer dissatisfaction due to restricted booking hours (only when phone lines are open).

### 2.2 Proposed System
The proposed **Radiance Salon Manager** is a centralized web platform.
*   **Features:**
    *   **Automated Booking:** Patients/customers can book anytime.
    *   **Conflict Resolution:** The system automatically checks for overlapping slots.
    *   **Role-Based Access:** Admins have full control; Staff have visibility; Customers have a personal portal.

### 2.3 Feasibility Study
*   **Technical Feasibility:** The project uses open-source, widely supported technologies (React, Node). Implementation is highly feasible with standard hardware.
*   **Operational Feasibility:** The interface is intuitive, requiring minimal training for staff.
*   **Economic Feasibility:** Development costs are low (student project), and it runs on standard hosting, making it cost-effective.

## 3. SYSTEM DESIGN
### 3.1 Entity Relationship Diagram (ERD)
The system is built on a relational schema connecting Users, Staff, Services, Appointments, and Reviews.

\`\`\`mermaid
erDiagram
    USERS ||--o{ STAFF : "is linked to"
    USERS ||--o{ CUSTOMERS : "is linked to"
    STAFF ||--o{ APPOINTMENTS : "performs"
    CUSTOMERS ||--o{ APPOINTMENTS : "books"
    SERVICES ||--o{ APPOINTMENTS : "includes"
    APPOINTMENTS ||--o{ REVIEWS : "receives"

    USERS {
        int id PK
        string email
        string password
        string role
    }
    STAFF {
        int id PK
        int user_id FK
        string specialization
        bool is_available
    }
    SERVICES {
        int id PK
        string name
        decimal price
        int duration_minutes
    }
    APPOINTMENTS {
        int id PK
        date date
        time time
        string status
    }
\`\`\`

### 3.2 Data Flow Diagram (DFD) - Level 0
The Context Level DFD shows the interaction between the three main entities: Admin, Customer, and the System.

\`\`\`mermaid
graph TD
    A[Admin] -->|Manage Staff/Services| S(Radiance Salon System)
    C[Customer] -->|Book Appointment/View History| S
    S -->|Booking Confirmation| C
    S -->|Reports/Dashboard Stats| A
\`\`\`

## 4. SYSTEM IMPLEMENTATION
### 4.1 Development Methodology
We utilized a **Modular Approach**. The application was divided into frontend and backend, and further into specific modules (Auth, Services, Booking).

### 4.2 Hardware & Software Setup
*   **Development Environment:** VS Code with ESLint and Prettier.
*   **Version Control:** Git for source code management.
*   **API Testing:** Postman was used to verify all 20+ API endpoints before frontend integration.

## 5. SYSTEM MAINTENANCE & EVALUATION
*   **Maintenance:** The codebase uses modular React components, making individual parts easy to update without affecting the whole system. The database is file-based (SQLite), making backups as simple as copying a file.
*   **Evaluation:** The system was evaluated against the initial objectives.
    *   *Objective:* Automation of booking. *Result:* Achieved (Verified by E2E tests).
    *   *Objective:* Admin oversight. *Result:* Achieved (Admin Panel fully functional).

## 6. COST AND BENEFIT ANALYSIS
*   **Costs:**
    *   Hosting: ~$5-10/month (e.g., DigitalOcean/Vercel).
    *   Development: 0 (Internal/Student Project).
*   **Benefits:**
    *   Reduced administrative labor (estimated 20 hours/month saved).
    *   Increased booking volume due to 24/7 availability.

## 7. TESTING REPORT
We performed rigorous testing to ensure reliability.

### 7.1 Testing Methodology
*   **Unit Testing:** Individual functions (e.g., "calculateTotalRevenue") were tested in isolation.
*   **Integration Testing:** API endpoints were tested to ensure the Database, Server, and Routes communicated correctly.
*   **System Testing (E2E):** End-to-end browser (customer booking flow) was automated and manually verified.

### 7.2 Test Cases (Sample)
| Test ID | Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Customer Registration | User created in DB | User created | PASS |
| TC-02 | Login with invalid creds | Show "Invalid Credentials" | Shown "Invalid Credentials" | PASS |
| TC-03 | Book slot (Staff busy) | Prevent Booking | Booking Prevented | PASS |
| TC-04 | Admin Add Service | Service appears in list | Service appears | PASS |

## 8. FUTURE ENHANCEMENTS
*   **SMS Notifications:** Integration with Twilio for booking reminders.
*   **Online Payments:** Integration with Stripe/Razorpay.
*   **AI Recommendations:** Suggesting services based on customer history.

## 9. CONCLUSION
The **Radiance Salon Manager** successfully digitizes the core operations of a salon. It is built on modern, scalable technology, offering a significant upgrade over manual methods. It fulfills the academic requirements while providing a practical, real-world solution.

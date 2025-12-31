# ANNEXURE: DATA DICTIONARY

This data dictionary provides a catalogue of the data elements used in the **Radiance Salon Manager** system, specifically within the SQLite database.

## 1. Table: users
*Stores authentication and profile information for all users (Admin, Staff, Customers).*

| Data Name | Type | Size | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | N/A | PK, Auto Increment | Unique identifier for the user |
| `full_name` | TEXT | N/A | NOT NULL | Full legal name of the user |
| `email` | TEXT | N/A | UNIQUE, NOT NULL | User's email address (used for login) |
| `password_hash` | TEXT | N/A | NOT NULL | Bcrypt hashed password |
| `phone` | TEXT | 15 | NULL | Contact phone number |
| `role` | TEXT | 10 | CHECK ('admin','staff','customer') | Role-based access control level |
| `is_active` | INTEGER | 1 | DEFAULT 1 | Account status (1=Active, 0=Inactive) |
| `created_at` | DATETIME | N/A | DEFAULT CURRENT_TIMESTAMP | Timestamp of account creation |

## 2. Table: services
*Stores the catalog of beauty services offered by the salon.*

| Data Name | Type | Size | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | N/A | PK, Auto Increment | Unique identifier for the service |
| `service_name` | TEXT | N/A | NOT NULL | Name of the service |
| `description` | TEXT | N/A | NULL | Detailed description of the service |
| `duration_minutes` | INTEGER | N/A | NOT NULL | Estimated time to complete service |
| `price` | DECIMAL | 10,2 | NOT NULL | Cost of the service |
| `category` | TEXT | 50 | NULL | Category (e.g., Hair, Skin, Nails) |
| `is_active` | INTEGER | 1 | DEFAULT 1 | Availability status |

## 3. Table: staff
*Stores comprehensive details about staff members.*

| Data Name | Type | Size | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | N/A | PK, Auto Increment | Unique identifier for staff profile |
| `user_id` | INTEGER | N/A | FK (users.id) | Link to the users table |
| `specialization` | TEXT | N/A | NULL | Primary skill area |
| `experience_years`| INTEGER | N/A | NULL | Years of professional experience |
| `bio` | TEXT | N/A | NULL | Staff biography |
| `is_available` | INTEGER | 1 | DEFAULT 1 | Current availability status |

## 4. Table: appointments
*Stores booking details connecting customers, staff, and services.*

| Data Name | Type | Size | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | N/A | PK, Auto Increment | Unique identifier for the appointment |
| `customer_id` | INTEGER | N/A | FK (customers.id) | Link to the customer |
| `staff_id` | INTEGER | N/A | FK (staff.id) | Link to the assigned staff |
| `service_id` | INTEGER | N/A | FK (services.id) | Link to the booked service |
| `appointment_date`| DATE | N/A | NOT NULL | Date of appointment |
| `appointment_time`| TIME | N/A | NOT NULL | Start time of appointment |
| `status` | TEXT | 15 | CHECK ('pending', 'confirmed', 'cancelled') | Current status of the booking |
| `notes` | TEXT | N/A | NULL | Special instructions from customer |

## Abbreviations
*   **PK**: Primary Key
*   **FK**: Foreign Key
*   **RBAC**: Role-Based Access Control
*   **API**: Application Programming Interface
*   **JSON**: JavaScript Object Notation
*   **JWT**: JSON Web Token
*   **URL**: Uniform Resource Locator

# USER / OPERATIONAL MANUAL

## 1. Introduction
This manual provides step-by-step instructions for using the **Radiance Salon Manager** web application.

## 2. Installation & Access
**For Users/Staff:**
1.  Open your web browser (Chrome, Safari, Firefox).
2.  Navigate to the URL provided by the administrator (e.g., `http://localhost:3000`).

**For Administrators (Deploying):**
1.  Ensure Node.js is installed.
2.  Run `npm start` in the frontend directory and `npm run dev` in the backend directory.

## 3. Customer Operations
### 3.1 Registration & Login
1.  Click **"Register"** on the homepage.
2.  Fill in your Name, Email, Phone, and Password.
3.  Click **"Create Account"**.
4.  Once registered, use your email and password to **Login**.

### 3.2 Booking an Appointment
1.  Navigate to the **"Services"** page.
2.  Browse available treatments (e.g., Haircut, Facial).
3.  Click **"Book Now"** on your desired service.
4.  Select a **Staff Member** from the dropdown.
5.  Pick a **Date** and **Time**.
6.  Click **"Confirm Booking"**. You will be redirected to your dashboard.

### 3.3 Managing Appointments
1.  Go to **"My Dashboard"**.
2.  View "Upcoming Appointments".
3.  To cancel, click the **"Cancel"** button next to the appointment.

## 4. Administrator Operations
### 4.1 Admin Dashboard
1.  Login with admin credentials.
2.  The Dashboard Overview shows:
    *   Total Revenue
    *   Total Appointments
    *   Active Staff Count

### 4.2 Managing Staff
1.  Navigate to the **"Staff"** tab.
2.  Click **"Add New Staff"**.
3.  Enter details (Name, Specialization, etc.).
4.  Toggle "Availability" to show/hide staff from booking.

### 4.3 Managing Services
1.  Navigate to the **"Services"** tab.
2.  Add or Edit services (Name, Price, Duration).
3.  Changes appear immediately on the public website.

## 5. Troubleshooting
*   **"Login Failed":** Double-check your email and password.
*   **"No Slots Available":** The selected staff member may be fully booked or off-duty. Try another date/time.
*   **"Connection Error":** Ensure your internet connection is active.

## 6. Security Best Practices
*   Always **Logout** when using a shared computer.
*   Do not share your password with anyone.
*   Admins should perform weekly backups of the `radiance_salon.db` file.

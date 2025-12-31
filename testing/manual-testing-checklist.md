# MANUAL TESTING CHECKLIST

## Quick Testing Guide for Radiance Salon Manager

---

## Pre-Testing Setup

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Database migrated with sample data
- [ ] Browser console open for error checking

---

## 1. Authentication & Registration

### User Registration
- [ ] Navigate to /register
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Verify success message
- [ ] Check redirect to dashboard
- [ ] Verify user in database

### User Login
- [ ] Navigate to /login
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify success message
- [ ] Check redirect to dashboard
- [ ] Verify token in localStorage

### Invalid Login
- [ ] Try wrong password
- [ ] Verify error message
- [ ] Try non-existent email
- [ ] Verify error message

### Password Validation
- [ ] Try password with < 6 characters
- [ ] Verify validation error
- [ ] Try empty password
- [ ] Verify required field error

---

## 2. Customer Features

### Browse Services
- [ ] Navigate to /services
- [ ] Verify all services load
- [ ] Check service cards display correctly
- [ ] Verify prices and durations shown

### Filter Services
- [ ] Click "All Services"
- [ ] Click each category filter
- [ ] Verify filtering works
- [ ] Check "All" shows everything

### Book Appointment
- [ ] Click "Book Now" on a service
- [ ] Login if prompted
- [ ] Select staff member
- [ ] Choose date (future)
- [ ] Choose time
- [ ] Add notes (optional)
- [ ] Submit booking
- [ ] Verify success message
- [ ] Check appointment appears in list

### View Appointments
- [ ] Navigate to /appointments
- [ ] Verify appointments display
- [ ] Check all details shown correctly
- [ ] Test status filters (All, Pending, etc.)

### Cancel Appointment
- [ ] Find a pending appointment
- [ ] Click "Cancel"
- [ ] Confirm cancellation
- [ ] Verify status changes to cancelled
- [ ] Check appointment list updates

### Dashboard
- [ ] Navigate to /dashboard
- [ ] Verify statistics display
- [ ] Check upcoming appointments show
- [ ] Test quick action buttons
- [ ] Verify user name displays

---

## 3. Admin Features

### Create Admin User
- [ ] Register a new user
- [ ] Access database: `sqlite3 database/radiance_salon.db`
- [ ] Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email';`
- [ ] Logout and login again
- [ ] Verify "Admin" menu appears

### Manage Services
- [ ] Navigate to Admin Panel
- [ ] Go to Services section
- [ ] Click "Add Service"
- [ ] Fill form with:
  - Service name
  - Description
  - Duration
  - Price
  - Category
- [ ] Submit and verify creation
- [ ] Edit a service
- [ ] Verify changes save
- [ ] Delete a test service
- [ ] Verify deletion

### Manage Staff
- [ ] Navigate to Staff Management
- [ ] Click "Add Staff"
- [ ] Fill form with:
  - Full name
  - Email
  - Password
  - Phone
  - Specialization
  - Experience
  - Bio
- [ ] Submit and verify creation
- [ ] Edit staff member
- [ ] Verify changes save

### Assign Services to Staff
- [ ] Select a staff member
- [ ] Click "Manage Services"
- [ ] Select services to assign
- [ ] Save assignments
- [ ] Verify services assigned

### View All Appointments
- [ ] Navigate to Appointments
- [ ] Verify can see all appointments (not just own)
- [ ] Filter by customer
- [ ] Filter by staff
- [ ] Filter by status
- [ ] Update appointment status

---

## 4. Staff Features

### Create Staff User
- [ ] Have admin create staff account
- [ ] Login as staff
- [ ] Verify limited menu (no admin panel)

### View Appointments
- [ ] Navigate to Appointments
- [ ] Verify only assigned appointments show
- [ ] Check appointment details

### Update Availability
- [ ] Navigate to Profile
- [ ] Toggle availability status
- [ ] Save changes
- [ ] Verify status updates

---

## 5. Security Testing

### Authorization
- [ ] Login as customer
- [ ] Try to access /admin (should fail)
- [ ] Logout
- [ ] Try to access /dashboard (should redirect to login)
- [ ] Login as staff
- [ ] Try to delete a service (should fail)

### Data Validation
- [ ] Try booking with past date (should fail)
- [ ] Try invalid email format (should fail)
- [ ] Try empty required fields (should fail)
- [ ] Try booking conflicting time slot (should fail)

---

## 6. UI/UX Testing

### Navigation
- [ ] Click all menu items
- [ ] Verify page transitions smooth
- [ ] Check back button works
- [ ] Test logo click (returns home)

### Responsive Design
- [ ] Resize browser to mobile width (< 768px)
- [ ] Verify layout adjusts
- [ ] Check navigation menu
- [ ] Test forms on mobile view
- [ ] Verify cards stack properly

### Forms
- [ ] Tab through form fields
- [ ] Check field focus styles
- [ ] Verify placeholder text
- [ ] Test form submission
- [ ] Check success/error messages
- [ ] Verify error highlighting

### Styling
- [ ] Check color scheme consistency
- [ ] Verify buttons hover states
- [ ] Check card shadows
- [ ] Verify typography is readable
- [ ] Test dark/light contrast

---

## 7. Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] Verify error message
- [ ] Try to book appointment
- [ ] Verify error message
- [ ] Restart server and retry

### Invalid Data
- [ ] Submit form with wrong data type
- [ ] Verify validation errors
- [ ] Check error messages are clear

---

## 8. Performance Testing

### Page Load
- [ ] Measure time to load home page
- [ ] Measure time to load services
- [ ] Measure time to load appointments
- [ ] All should load < 2 seconds

### API Response
- [ ] Check Network tab in DevTools
- [ ] Verify API calls < 200ms
- [ ] Check for unnecessary requests

---

## 9. Cross-Browser Testing

### Chrome
- [ ] Test all features
- [ ] Check console for errors
- [ ] Verify styling

### Firefox
- [ ] Test all features
- [ ] Check console for errors
- [ ] Verify styling

### Safari (if on Mac)
- [ ] Test all features
- [ ] Check console for errors
- [ ] Verify styling

---

## 10. Database Testing

### Data Integrity
- [ ] Create appointment
- [ ] Check database: `sqlite3 database/radiance_salon.db`
- [ ] Run: `SELECT * FROM appointments ORDER BY id DESC LIMIT 1;`
- [ ] Verify data is correct
- [ ] Check foreign keys are valid

### Cascade Delete
- [ ] Delete a user
- [ ] Verify related records deleted (customer/staff profile)

---

## 11. Edge Cases

### Booking
- [ ] Try booking same slot twice
- [ ] Try booking on holiday/closed day (if implemented)
- [ ] Try booking outside business hours

### Services
- [ ] Create service with very long name
- [ ] Create service with price 0
- [ ] Create service with large duration

---

## Test Results Tracking

Record results:

| Feature | Status | Notes |
|---------|--------|-------|
| Registration | ✅/❌ | |
| Login | ✅/❌ | |
| Services | ✅/❌ | |
| Booking | ✅/❌ | |
| Admin Panel | ✅/❌ | |
| Staff Features | ✅/❌ | |
| Responsive | ✅/❌ | |

---

## Issues Found

Document any issues:

1. **Issue**: Description
   - **Severity**: Critical/Major/Minor
   - **Steps to reproduce**:
   - **Expected**:
   - **Actual**:
   - **Status**: Open/Fixed

---

## Sign-off

- [ ] All critical features tested
- [ ] No critical bugs found
- [ ] UI/UX is acceptable
- [ ] Performance is acceptable
- [ ] Security checks passed
- [ ] Ready for deployment

**Tester**: _______________
**Date**: _______________
**Status**: PASS / FAIL

---

*End of Checklist*

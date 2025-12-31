# Database Directory

This directory contains the SQLite database for Radiance Salon Manager.

## Database File

- **radiance_salon.db** - Main application database

## Schema

The database includes the following tables:

1. **users** - User accounts (customers, staff, admin)
2. **customers** - Customer-specific information
3. **staff** - Staff member profiles
4. **services** - Available salon services
5. **appointments** - Booking records
6. **staff_services** - Many-to-many relationship (staff ↔ services)
7. **business_hours** - Salon operating hours
8. **reviews** - Customer reviews (for future use)
9. **payments** - Payment records (for future use)

## Accessing the Database

### Using SQLite3 CLI

```bash
# Open database
sqlite3 radiance_salon.db

# List all tables
.tables

# View table schema
.schema users

# Query data
SELECT * FROM services;

# Exit
.quit
```

### Useful Queries

**View all users:**
```sql
SELECT id, full_name, email, role FROM users;
```

**View appointments with details:**
```sql
SELECT
  a.id,
  u_customer.full_name as customer,
  u_staff.full_name as staff,
  s.service_name,
  a.appointment_date,
  a.appointment_time,
  a.status
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN users u_customer ON c.user_id = u_customer.id
JOIN staff st ON a.staff_id = st.id
JOIN users u_staff ON st.user_id = u_staff.id
JOIN services s ON a.service_id = s.id
ORDER BY a.appointment_date DESC;
```

**Count appointments by status:**
```sql
SELECT status, COUNT(*) as count
FROM appointments
GROUP BY status;
```

**Make user an admin:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Backup

To backup the database:

```bash
# Create backup
cp radiance_salon.db radiance_salon_backup_$(date +%Y%m%d).db

# Or using SQLite
sqlite3 radiance_salon.db ".backup radiance_salon_backup.db"
```

## Migration

Database tables are created by running:

```bash
cd ../backend
npm run migrate
```

This will:
1. Create all tables
2. Set up foreign keys
3. Insert sample data (services, business hours)

## Sample Data

After migration, the database includes:

- 8 sample services (Haircut, Facial, Manicure, etc.)
- Business hours (Monday-Sunday)
- No users (created during registration)

## Database Location

The database file location is configured in:
- `backend/.env` → `DATABASE_PATH` variable

Default: `../database/radiance_salon.db`

## Notes

- SQLite is file-based (no server needed)
- Database file is included in .gitignore
- Foreign keys are enabled for data integrity
- Timestamps are automatic (created_at, updated_at)

## Security

⚠️ **Important**:
- Never commit database file to version control
- Backup regularly in production
- Use proper file permissions (chmod 600)
- Sanitize all inputs (prevent SQL injection)

---

*For detailed schema information, see TECHNICAL_DOCUMENTATION.md*

const database = require('./database');

const createTables = async () => {
  try {
    await database.connect();

    // Users table - stores salon staff and administrators
    await database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone TEXT,
        role TEXT CHECK(role IN ('admin', 'staff', 'customer')) DEFAULT 'customer',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table - salon services offered
    await database.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_name TEXT NOT NULL,
        description TEXT,
        duration_minutes INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Staff members table
    await database.run(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        specialization TEXT,
        experience_years INTEGER,
        bio TEXT,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Staff-Service mapping (many-to-many)
    await database.run(`
      CREATE TABLE IF NOT EXISTS staff_services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        UNIQUE(staff_id, service_id)
      )
    `);

    // Customers table
    await database.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date_of_birth DATE,
        address TEXT,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Appointments/Bookings table
    await database.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        staff_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')) DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);

    // Business hours table
    await database.run(`
      CREATE TABLE IF NOT EXISTS business_hours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_of_week INTEGER CHECK(day_of_week BETWEEN 0 AND 6),
        open_time TIME,
        close_time TIME,
        is_closed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reviews and ratings table
    await database.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        staff_id INTEGER NOT NULL,
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
      )
    `);

    // Payments table
    await database.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'upi', 'online')),
        payment_status TEXT CHECK(payment_status IN ('pending', 'completed', 'refunded', 'failed')) DEFAULT 'pending',
        transaction_id TEXT,
        payment_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    console.log('All tables created successfully');

    // Insert default business hours
    await seedDefaultData();

    console.log('Database migration completed successfully');
    await database.close();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

const seedDefaultData = async () => {
  // Insert default business hours (Monday to Sunday)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < 7; i++) {
    const existingHours = await database.get('SELECT * FROM business_hours WHERE day_of_week = ?', [i]);

    if (!existingHours) {
      // Saturday: 9 AM - 8 PM, Sunday: Closed, Weekdays: 9 AM - 7 PM
      const isClosed = i === 0 ? 0 : 0; // All days open by default
      const openTime = '09:00:00';
      const closeTime = i === 6 ? '20:00:00' : '19:00:00';

      await database.run(
        'INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?)',
        [i, openTime, closeTime, isClosed]
      );
    }
  }

  // Insert sample services
  const sampleServices = [
    { name: 'Haircut & Styling', description: 'Professional haircut with styling', duration: 45, price: 500, category: 'Hair' },
    { name: 'Hair Coloring', description: 'Full hair color treatment', duration: 120, price: 2000, category: 'Hair' },
    { name: 'Facial Treatment', description: 'Deep cleansing facial', duration: 60, price: 1200, category: 'Skin' },
    { name: 'Manicure', description: 'Hand care and nail polish', duration: 30, price: 400, category: 'Nails' },
    { name: 'Pedicure', description: 'Foot care and nail polish', duration: 45, price: 600, category: 'Nails' },
    { name: 'Bridal Makeup', description: 'Complete bridal makeup package', duration: 180, price: 5000, category: 'Makeup' },
    { name: 'Hair Spa', description: 'Relaxing hair spa treatment', duration: 90, price: 1500, category: 'Hair' },
    { name: 'Waxing (Full Body)', description: 'Complete body waxing', duration: 90, price: 1800, category: 'Body' }
  ];

  for (const service of sampleServices) {
    const existing = await database.get('SELECT * FROM services WHERE service_name = ?', [service.name]);
    if (!existing) {
      await database.run(
        'INSERT INTO services (service_name, description, duration_minutes, price, category) VALUES (?, ?, ?, ?, ?)',
        [service.name, service.description, service.duration, service.price, service.category]
      );
    }
  }

  console.log('Default data seeded successfully');
};

// Run migration
createTables();

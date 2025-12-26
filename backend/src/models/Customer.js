const database = require('../config/database');

class Customer {
  static async create({ user_id, date_of_birth, address, preferences }) {
    const result = await database.run(
      `INSERT INTO customers (user_id, date_of_birth, address, preferences)
       VALUES (?, ?, ?, ?)`,
      [user_id, date_of_birth, address, preferences]
    );

    return result.id;
  }

  static async findById(id) {
    return await database.get(`
      SELECT c.*, u.full_name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);
  }

  static async findByUserId(user_id) {
    return await database.get(`
      SELECT c.*, u.full_name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
    `, [user_id]);
  }

  static async findAll() {
    return await database.all(`
      SELECT c.*, u.full_name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      ORDER BY u.full_name
    `);
  }

  static async update(id, { date_of_birth, address, preferences }) {
    const updates = [];
    const values = [];

    if (date_of_birth) {
      updates.push('date_of_birth = ?');
      values.push(date_of_birth);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (preferences !== undefined) {
      updates.push('preferences = ?');
      values.push(preferences);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`;
    return await database.run(sql, values);
  }

  static async delete(id) {
    return await database.run('DELETE FROM customers WHERE id = ?', [id]);
  }

  static async getAppointmentHistory(id) {
    return await database.all(`
      SELECT a.*,
             u_staff.full_name as staff_name,
             s.service_name, s.price
      FROM appointments a
      JOIN staff st ON a.staff_id = st.id
      JOIN users u_staff ON st.user_id = u_staff.id
      JOIN services s ON a.service_id = s.id
      WHERE a.customer_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [id]);
  }
}

module.exports = Customer;

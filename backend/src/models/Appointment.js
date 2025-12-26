const database = require('../config/database');

class Appointment {
  static async create({ customer_id, staff_id, service_id, appointment_date, appointment_time, end_time, notes }) {
    const result = await database.run(
      `INSERT INTO appointments (customer_id, staff_id, service_id, appointment_date, appointment_time, end_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, staff_id, service_id, appointment_date, appointment_time, end_time, notes]
    );

    return result.id;
  }

  static async findById(id) {
    return await database.get(`
      SELECT a.*,
             u_customer.full_name as customer_name, u_customer.email as customer_email, u_customer.phone as customer_phone,
             u_staff.full_name as staff_name,
             s.service_name, s.price, s.duration_minutes
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN users u_customer ON c.user_id = u_customer.id
      JOIN staff st ON a.staff_id = st.id
      JOIN users u_staff ON st.user_id = u_staff.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `, [id]);
  }

  static async findAll(filters = {}) {
    let sql = `
      SELECT a.*,
             u_customer.full_name as customer_name,
             u_staff.full_name as staff_name,
             s.service_name, s.price
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN users u_customer ON c.user_id = u_customer.id
      JOIN staff st ON a.staff_id = st.id
      JOIN users u_staff ON st.user_id = u_staff.id
      JOIN services s ON a.service_id = s.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.customer_id) {
      sql += ' AND a.customer_id = ?';
      params.push(filters.customer_id);
    }

    if (filters.staff_id) {
      sql += ' AND a.staff_id = ?';
      params.push(filters.staff_id);
    }

    if (filters.status) {
      sql += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      sql += ' AND a.appointment_date = ?';
      params.push(filters.date);
    }

    if (filters.from_date) {
      sql += ' AND a.appointment_date >= ?';
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      sql += ' AND a.appointment_date <= ?';
      params.push(filters.to_date);
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    return await database.all(sql, params);
  }

  static async findByDateAndStaff(date, staff_id) {
    return await database.all(`
      SELECT * FROM appointments
      WHERE appointment_date = ? AND staff_id = ? AND status NOT IN ('cancelled')
      ORDER BY appointment_time
    `, [date, staff_id]);
  }

  static async updateStatus(id, status) {
    return await database.run(
      'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  }

  static async update(id, { appointment_date, appointment_time, end_time, notes, status }) {
    const updates = [];
    const values = [];

    if (appointment_date) {
      updates.push('appointment_date = ?');
      values.push(appointment_date);
    }
    if (appointment_time) {
      updates.push('appointment_time = ?');
      values.push(appointment_time);
    }
    if (end_time) {
      updates.push('end_time = ?');
      values.push(end_time);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    return await database.run(sql, values);
  }

  static async delete(id) {
    return await database.run('DELETE FROM appointments WHERE id = ?', [id]);
  }

  static async getUpcoming(customer_id) {
    return await database.all(`
      SELECT a.*,
             u_staff.full_name as staff_name,
             s.service_name, s.price, s.duration_minutes
      FROM appointments a
      JOIN staff st ON a.staff_id = st.id
      JOIN users u_staff ON st.user_id = u_staff.id
      JOIN services s ON a.service_id = s.id
      WHERE a.customer_id = ? AND a.appointment_date >= DATE('now') AND a.status IN ('pending', 'confirmed')
      ORDER BY a.appointment_date, a.appointment_time
    `, [customer_id]);
  }

  static async checkAvailability(staff_id, appointment_date, appointment_time, end_time, exclude_appointment_id = null) {
    let sql = `
      SELECT COUNT(*) as count FROM appointments
      WHERE staff_id = ?
        AND appointment_date = ?
        AND status NOT IN ('cancelled')
        AND (
          (appointment_time < ? AND end_time > ?) OR
          (appointment_time < ? AND end_time > ?) OR
          (appointment_time >= ? AND end_time <= ?)
        )
    `;

    const params = [staff_id, appointment_date, end_time, appointment_time, end_time, end_time, appointment_time, end_time];

    if (exclude_appointment_id) {
      sql += ' AND id != ?';
      params.push(exclude_appointment_id);
    }

    const result = await database.get(sql, params);
    return result.count === 0;
  }
}

module.exports = Appointment;

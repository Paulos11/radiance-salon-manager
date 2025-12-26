const database = require('../config/database');

class Staff {
  static async create({ user_id, specialization, experience_years, bio }) {
    const result = await database.run(
      `INSERT INTO staff (user_id, specialization, experience_years, bio)
       VALUES (?, ?, ?, ?)`,
      [user_id, specialization, experience_years, bio]
    );

    return result.id;
  }

  static async findById(id) {
    return await database.get(`
      SELECT s.*, u.full_name, u.email, u.phone, u.is_active
      FROM staff s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [id]);
  }

  static async findByUserId(user_id) {
    return await database.get(`
      SELECT s.*, u.full_name, u.email, u.phone, u.is_active
      FROM staff s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `, [user_id]);
  }

  static async findAll(availableOnly = false) {
    let sql = `
      SELECT s.*, u.full_name, u.email, u.phone, u.is_active
      FROM staff s
      JOIN users u ON s.user_id = u.id
    `;

    if (availableOnly) {
      sql += ' WHERE s.is_available = 1 AND u.is_active = 1';
    }

    sql += ' ORDER BY u.full_name';

    return await database.all(sql);
  }

  static async update(id, { specialization, experience_years, bio, is_available }) {
    const updates = [];
    const values = [];

    if (specialization) {
      updates.push('specialization = ?');
      values.push(specialization);
    }
    if (experience_years !== undefined) {
      updates.push('experience_years = ?');
      values.push(experience_years);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }
    if (is_available !== undefined) {
      updates.push('is_available = ?');
      values.push(is_available);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE staff SET ${updates.join(', ')} WHERE id = ?`;
    return await database.run(sql, values);
  }

  static async delete(id) {
    return await database.run('DELETE FROM staff WHERE id = ?', [id]);
  }

  static async addService(staff_id, service_id) {
    return await database.run(
      'INSERT OR IGNORE INTO staff_services (staff_id, service_id) VALUES (?, ?)',
      [staff_id, service_id]
    );
  }

  static async removeService(staff_id, service_id) {
    return await database.run(
      'DELETE FROM staff_services WHERE staff_id = ? AND service_id = ?',
      [staff_id, service_id]
    );
  }

  static async getServices(staff_id) {
    return await database.all(`
      SELECT s.* FROM services s
      JOIN staff_services ss ON s.id = ss.service_id
      WHERE ss.staff_id = ? AND s.is_active = 1
    `, [staff_id]);
  }

  static async findByService(service_id) {
    return await database.all(`
      SELECT st.*, u.full_name, u.email, u.phone
      FROM staff st
      JOIN users u ON st.user_id = u.id
      JOIN staff_services ss ON st.id = ss.staff_id
      WHERE ss.service_id = ? AND st.is_available = 1 AND u.is_active = 1
    `, [service_id]);
  }
}

module.exports = Staff;

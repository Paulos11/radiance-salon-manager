const database = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ full_name, email, password, phone, role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await database.run(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, hashedPassword, phone, role]
    );

    return result.id;
  }

  static async findByEmail(email) {
    return await database.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return await database.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async findAll(role = null) {
    if (role) {
      return await database.all('SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE role = ?', [role]);
    }
    return await database.all('SELECT id, full_name, email, phone, role, is_active, created_at FROM users');
  }

  static async update(id, { full_name, email, phone, is_active }) {
    const updates = [];
    const values = [];

    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    return await database.run(sql, values);
  }

  static async delete(id) {
    return await database.run('DELETE FROM users WHERE id = ?', [id]);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await database.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );
  }
}

module.exports = User;

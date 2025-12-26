const database = require('../config/database');

class Service {
  static async create({ service_name, description, duration_minutes, price, category }) {
    const result = await database.run(
      `INSERT INTO services (service_name, description, duration_minutes, price, category)
       VALUES (?, ?, ?, ?, ?)`,
      [service_name, description, duration_minutes, price, category]
    );

    return result.id;
  }

  static async findById(id) {
    return await database.get('SELECT * FROM services WHERE id = ?', [id]);
  }

  static async findAll(activeOnly = true) {
    if (activeOnly) {
      return await database.all('SELECT * FROM services WHERE is_active = 1 ORDER BY category, service_name');
    }
    return await database.all('SELECT * FROM services ORDER BY category, service_name');
  }

  static async findByCategory(category) {
    return await database.all('SELECT * FROM services WHERE category = ? AND is_active = 1', [category]);
  }

  static async update(id, { service_name, description, duration_minutes, price, category, is_active }) {
    const updates = [];
    const values = [];

    if (service_name) {
      updates.push('service_name = ?');
      values.push(service_name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (duration_minutes) {
      updates.push('duration_minutes = ?');
      values.push(duration_minutes);
    }
    if (price) {
      updates.push('price = ?');
      values.push(price);
    }
    if (category) {
      updates.push('category = ?');
      values.push(category);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE services SET ${updates.join(', ')} WHERE id = ?`;
    return await database.run(sql, values);
  }

  static async delete(id) {
    return await database.run('DELETE FROM services WHERE id = ?', [id]);
  }

  static async getCategories() {
    const result = await database.all('SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category');
    return result.map(row => row.category);
  }
}

module.exports = Service;

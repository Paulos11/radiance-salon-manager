const request = require('supertest');
const app = require('../src/server');
const database = require('../src/config/database');

describe('Services API Tests', () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.close();
  });

  describe('GET /api/services', () => {
    it('should get all services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/services/categories', () => {
    it('should get all service categories', async () => {
      const response = await request(app)
        .get('/api/services/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/services/:id', () => {
    it('should get a specific service', async () => {
      const response = await request(app)
        .get('/api/services/1')
        .expect(200);

      if (response.body.data) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('service_name');
      }
    });

    it('should return 404 for non-existent service', async () => {
      const response = await request(app)
        .get('/api/services/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

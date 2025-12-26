const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
} = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/:id', getService);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('service_name').notEmpty().withMessage('Service name is required'),
    body('duration_minutes')
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    validate
  ],
  createService
);

router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;

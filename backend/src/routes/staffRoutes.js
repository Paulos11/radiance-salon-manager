const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffServices,
  addStaffService,
  removeStaffService,
  getStaffByService
} = require('../controllers/staffController');

const router = express.Router();

router.get('/', getAllStaff);
router.get('/service/:service_id', getStaffByService);
router.get('/:id', getStaff);
router.get('/:id/services', getStaffServices);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    validate
  ],
  createStaff
);

router.put('/:id', protect, authorize('admin'), updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);
router.post('/:id/services', protect, authorize('admin'), addStaffService);
router.delete('/:id/services/:service_id', protect, authorize('admin'), removeStaffService);

module.exports = router;

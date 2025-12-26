const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', protect, getAllAppointments);
router.get('/upcoming', protect, authorize('customer'), getUpcomingAppointments);
router.get('/:id', protect, getAppointment);

router.post(
  '/',
  protect,
  [
    body('service_id').notEmpty().withMessage('Service is required'),
    body('staff_id').notEmpty().withMessage('Staff member is required'),
    body('appointment_date').notEmpty().withMessage('Appointment date is required'),
    body('appointment_time').notEmpty().withMessage('Appointment time is required'),
    validate
  ],
  createAppointment
);

router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;

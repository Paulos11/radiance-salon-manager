const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// All review routes require authentication
router.use(protect);

// Get all reviews for a staff member
router.get('/staff/:staffId', reviewController.getStaffReviews);

// Get review for a specific appointment
router.get('/appointment/:appointmentId', reviewController.getAppointmentReview);

// Create a review
router.post('/', reviewController.createReview);

// Update a review
router.put('/:id', reviewController.updateReview);

// Delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

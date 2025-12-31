const db = require('../config/database');

// Get all reviews for a staff member
exports.getStaffReviews = async (req, res) => {
  try {
    const { staffId } = req.params;

    const reviews = await db.all(
      `SELECT r.*, u.full_name as customer_name, s.service_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       JOIN appointments a ON r.appointment_id = a.id
       JOIN services s ON a.service_id = s.id
       WHERE r.staff_id = ?
       ORDER BY r.created_at DESC`,
      [staffId]
    );

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: avgRating.toFixed(1),
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Get staff reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

// Get review for a specific appointment
exports.getAppointmentReview = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const review = await db.get(
      `SELECT r.*, u.full_name as customer_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.appointment_id = ?`,
      [appointmentId]
    );

    res.json({
      success: true,
      data: review || null
    });
  } catch (error) {
    console.error('Get appointment review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review'
    });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { appointment_id, rating, review_text } = req.body;
    const customer_id = req.user.id;

    // Validate input
    if (!appointment_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if appointment exists and belongs to customer
    const appointment = await db.get(
      'SELECT * FROM appointments WHERE id = ? AND customer_id = ?',
      [appointment_id, customer_id]
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or unauthorized'
      });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed appointments'
      });
    }

    // Check if review already exists
    const existingReview = await db.get(
      'SELECT * FROM reviews WHERE appointment_id = ?',
      [appointment_id]
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this appointment'
      });
    }

    // Create review
    const result = await db.run(
      `INSERT INTO reviews (appointment_id, customer_id, staff_id, rating, review_text)
       VALUES (?, ?, ?, ?, ?)`,
      [appointment_id, customer_id, appointment.staff_id, rating, review_text || '']
    );

    const newReview = await db.get(
      'SELECT * FROM reviews WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review'
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;
    const customer_id = req.user.id;

    // Check if review exists and belongs to customer
    const review = await db.get(
      'SELECT * FROM reviews WHERE id = ? AND customer_id = ?',
      [id, customer_id]
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update review
    await db.run(
      `UPDATE reviews
       SET rating = COALESCE(?, rating),
           review_text = COALESCE(?, review_text)
       WHERE id = ?`,
      [rating, review_text, id]
    );

    const updatedReview = await db.get(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const customer_id = req.user.id;

    // Check if review exists and belongs to customer (or user is admin)
    const review = await db.get(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only allow deletion by review owner or admin
    if (review.customer_id !== customer_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this review'
      });
    }

    await db.run('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
};

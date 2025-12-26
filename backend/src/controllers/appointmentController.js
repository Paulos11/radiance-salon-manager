const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');

exports.getAllAppointments = async (req, res) => {
  try {
    const { customer_id, staff_id, status, date, from_date, to_date } = req.query;

    const filters = {};

    // If user is customer, only show their appointments
    if (req.user.role === 'customer') {
      const customer = await Customer.findByUserId(req.user.id);
      filters.customer_id = customer.id;
    } else if (req.user.role === 'staff') {
      const staff = await Staff.findByUserId(req.user.id);
      filters.staff_id = staff.id;
    } else {
      // Admin can filter by customer_id or staff_id
      if (customer_id) filters.customer_id = customer_id;
      if (staff_id) filters.staff_id = staff_id;
    }

    if (status) filters.status = status;
    if (date) filters.date = date;
    if (from_date) filters.from_date = from_date;
    if (to_date) filters.to_date = to_date;

    const appointments = await Appointment.findAll(filters);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'customer') {
      const customer = await Customer.findByUserId(req.user.id);
      if (appointment.customer_id !== customer.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this appointment'
        });
      }
    } else if (req.user.role === 'staff') {
      const staff = await Staff.findByUserId(req.user.id);
      if (appointment.staff_id !== staff.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this appointment'
        });
      }
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { service_id, staff_id, appointment_date, appointment_time, notes } = req.body;

    // Get customer ID
    let customer_id;
    if (req.user.role === 'customer') {
      const customer = await Customer.findByUserId(req.user.id);
      customer_id = customer.id;
    } else {
      // Admin creating appointment for a customer
      customer_id = req.body.customer_id;
      if (!customer_id) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }
    }

    // Get service to calculate end time
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Calculate end time
    const startTime = new Date(`2000-01-01 ${appointment_time}`);
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);
    const end_time = endTime.toTimeString().slice(0, 8);

    // Check staff availability
    const isAvailable = await Appointment.checkAvailability(
      staff_id,
      appointment_date,
      appointment_time,
      end_time
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Staff is not available at the selected time'
      });
    }

    const appointmentId = await Appointment.create({
      customer_id,
      staff_id,
      service_id,
      appointment_date,
      appointment_time,
      end_time,
      notes
    });

    const appointment = await Appointment.findById(appointmentId);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { appointment_date, appointment_time, notes, status } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'customer') {
      const customer = await Customer.findByUserId(req.user.id);
      if (appointment.customer_id !== customer.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment'
        });
      }
      // Customers can only cancel or update notes
      if (status && status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only cancel appointments'
        });
      }
    }

    // If rescheduling, check availability
    if (appointment_date || appointment_time) {
      const service = await Service.findById(appointment.service_id);
      const startTime = new Date(`2000-01-01 ${appointment_time || appointment.appointment_time}`);
      const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);
      const end_time = endTime.toTimeString().slice(0, 8);

      const isAvailable = await Appointment.checkAvailability(
        appointment.staff_id,
        appointment_date || appointment.appointment_date,
        appointment_time || appointment.appointment_time,
        end_time,
        req.params.id
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Staff is not available at the selected time'
        });
      }

      await Appointment.update(req.params.id, {
        appointment_date,
        appointment_time,
        end_time,
        notes,
        status
      });
    } else {
      await Appointment.update(req.params.id, { notes, status });
    }

    const updatedAppointment = await Appointment.findById(req.params.id);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await Appointment.delete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};

exports.getUpcomingAppointments = async (req, res) => {
  try {
    const customer = await Customer.findByUserId(req.user.id);
    const appointments = await Appointment.getUpcoming(customer.id);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming appointments',
      error: error.message
    });
  }
};

const Staff = require('../models/Staff');
const User = require('../models/User');

exports.getAllStaff = async (req, res) => {
  try {
    const { available_only } = req.query;
    const staff = await Staff.findAll(available_only === 'true');

    res.json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff',
      error: error.message
    });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff member',
      error: error.message
    });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { full_name, email, password, phone, specialization, experience_years, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user account
    const userId = await User.create({
      full_name,
      email,
      password,
      phone,
      role: 'staff'
    });

    // Create staff profile
    const staffId = await Staff.create({
      user_id: userId,
      specialization,
      experience_years,
      bio
    });

    const staff = await Staff.findById(staffId);

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staff
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating staff member',
      error: error.message
    });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { full_name, phone, specialization, experience_years, bio, is_available } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Update user info
    if (full_name || phone) {
      await User.update(staff.user_id, { full_name, phone });
    }

    // Update staff info
    await Staff.update(req.params.id, {
      specialization,
      experience_years,
      bio,
      is_available
    });

    const updatedStaff = await Staff.findById(req.params.id);

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updatedStaff
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating staff member',
      error: error.message
    });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    await Staff.delete(req.params.id);

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting staff member',
      error: error.message
    });
  }
};

exports.getStaffServices = async (req, res) => {
  try {
    const services = await Staff.getServices(req.params.id);

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get staff services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff services',
      error: error.message
    });
  }
};

exports.addStaffService = async (req, res) => {
  try {
    const { service_id } = req.body;

    await Staff.addService(req.params.id, service_id);

    res.json({
      success: true,
      message: 'Service added to staff member successfully'
    });
  } catch (error) {
    console.error('Add staff service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding service to staff member',
      error: error.message
    });
  }
};

exports.removeStaffService = async (req, res) => {
  try {
    const { service_id } = req.params;

    await Staff.removeService(req.params.id, service_id);

    res.json({
      success: true,
      message: 'Service removed from staff member successfully'
    });
  } catch (error) {
    console.error('Remove staff service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing service from staff member',
      error: error.message
    });
  }
};

exports.getStaffByService = async (req, res) => {
  try {
    const staff = await Staff.findByService(req.params.service_id);

    res.json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    console.error('Get staff by service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff by service',
      error: error.message
    });
  }
};

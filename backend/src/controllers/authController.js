const User = require('../models/User');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, date_of_birth, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const userId = await User.create({
      full_name,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    // Create customer profile if role is customer
    if (!role || role === 'customer') {
      await Customer.create({
        user_id: userId,
        date_of_birth: date_of_birth || null,
        address: address || null,
        preferences: null
      });
    }

    const user = await User.findById(userId);
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Validate password
    const isMatch = await User.validatePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let profile = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active
    };

    // Get additional profile data based on role
    if (user.role === 'customer') {
      const customer = await Customer.findByUserId(user.id);
      if (customer) {
        profile.customer_id = customer.id;
        profile.date_of_birth = customer.date_of_birth;
        profile.address = customer.address;
        profile.preferences = customer.preferences;
      }
    } else if (user.role === 'staff') {
      const staff = await Staff.findByUserId(user.id);
      if (staff) {
        profile.staff_id = staff.id;
        profile.specialization = staff.specialization;
        profile.experience_years = staff.experience_years;
        profile.bio = staff.bio;
        profile.is_available = staff.is_available;
      }
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, date_of_birth, address, preferences } = req.body;

    // Update user basic info
    if (full_name || phone) {
      await User.update(req.user.id, { full_name, phone });
    }

    // Update customer-specific info
    if (req.user.role === 'customer') {
      const customer = await Customer.findByUserId(req.user.id);
      if (customer) {
        await Customer.update(customer.id, { date_of_birth, address, preferences });
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await User.validatePassword(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    await User.changePassword(req.user.id, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try {
    const { category, include_inactive } = req.query;

    let services;
    if (category) {
      services = await Service.findByCategory(category);
    } else {
      services = await Service.findAll(!include_inactive);
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { service_name, description, duration_minutes, price, category } = req.body;

    const serviceId = await Service.create({
      service_name,
      description,
      duration_minutes,
      price,
      category
    });

    const service = await Service.findById(serviceId);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { service_name, description, duration_minutes, price, category, is_active } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await Service.update(req.params.id, {
      service_name,
      description,
      duration_minutes,
      price,
      category,
      is_active
    });

    const updatedService = await Service.findById(req.params.id);

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await Service.delete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.getCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

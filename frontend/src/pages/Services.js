import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import { toast } from 'react-toastify';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      toast.error('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      if (response.data.success) {
        setCategories(['all', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error loading categories');
    }
  };

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      toast.info('Please login to book an appointment');
      navigate('/login');
      return;
    }

    navigate('/appointments/new', { state: { service } });
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page services-page">
      <div className="container">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">
          Discover our wide range of professional beauty and wellness services
        </p>

        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Services' : category}
            </button>
          ))}
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-center text-gray">No services available in this category</p>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

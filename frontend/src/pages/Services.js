import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';

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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">Our Services</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover our wide range of professional beauty and wellness services designed to help you look and feel your absolute best.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category === 'all' ? 'All Services' : category}
            </button>
          ))}
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">No services available in this category</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedCategory('all')}
            >
              View All Services
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

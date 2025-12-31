import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedService = location.state?.service;

  const [formData, setFormData] = useState({
    service_id: preselectedService?.id || '',
    staff_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const [services, setServices] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Load staff when service is selected
  useEffect(() => {
    if (formData.service_id) {
      loadAvailableStaff(formData.service_id);
    } else {
      setAvailableStaff([]);
      setFormData(prev => ({ ...prev, staff_id: '' }));
    }
  }, [formData.service_id]);

  const loadServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
      console.error('Error loading services:', error);
    }
  };

  const loadAvailableStaff = async (serviceId) => {
    try {
      const response = await api.get(`/staff/service/${serviceId}`);
      setAvailableStaff(response.data);
      if (response.data.length === 0) {
        toast.warning('No staff available for this service');
      }
    } catch (error) {
      toast.error('Failed to load available staff');
      console.error('Error loading staff:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.service_id || !formData.staff_id || !formData.appointment_date || !formData.appointment_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.appointment_date + 'T' + formData.appointment_time);
    if (selectedDate < new Date()) {
      toast.error('Cannot book appointments in the past');
      return;
    }

    setLoading(true);
    try {
      await api.post('/appointments', formData);
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === parseInt(formData.service_id));

  // Generate time slots (9 AM to 7 PM in 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 19 && minute > 0) break; // Stop at 7:00 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">Book an Appointment</h1>
          <p className="mt-2 text-neutral-600">Schedule your visit to Radiance Salon</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Select
                  label="Select Service *"
                  id="service_id"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  options={[
                    { value: '', label: '-- Choose a service --' },
                    ...services.map(s => ({ 
                      value: s.id, 
                      label: `${s.service_name} - ₹${s.price} (${s.duration_minutes} min)` 
                    }))
                  ]}
                />

                {selectedService && (
                  <div className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/10">
                    <h3 className="font-bold text-primary-dark mb-2">{selectedService.service_name}</h3>
                    <p className="text-sm text-neutral-600 mb-3">{selectedService.description}</p>
                    <div className="flex gap-4 text-sm font-medium text-neutral-700">
                      <span>⏱ {selectedService.duration_minutes} mins</span>
                      <span>💰 ₹{selectedService.price}</span>
                      <span>🏷 {selectedService.category}</span>
                    </div>
                  </div>
                )}

                <Select
                  label="Select Staff Member *"
                  id="staff_id"
                  name="staff_id"
                  value={formData.staff_id}
                  onChange={handleChange}
                  disabled={!formData.service_id || availableStaff.length === 0}
                  required
                  options={[
                    { value: '', label: !formData.service_id ? '-- Select a service first --' : availableStaff.length === 0 ? '-- No staff available --' : '-- Choose a staff member --' },
                    ...availableStaff.map(s => ({
                      value: s.id,
                      label: `${s.full_name} - ${s.specialization} (${s.experience_years}y exp)`
                    }))
                  ]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Appointment Date *"
                    type="date"
                    id="appointment_date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={today}
                    required
                    containerClassName="mb-0"
                  />

                  <Select
                    label="Appointment Time *"
                    id="appointment_time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    required
                    containerClassName="mb-0"
                    options={[
                      { value: '', label: '-- Choose a time --' },
                      ...timeSlots.map(t => ({ value: t, label: t }))
                    ]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Any special requests..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/services')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full shadow-md"
                    isLoading={loading}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900 text-white border-none">
              <h3 className="text-xl font-serif font-bold mb-6 text-white">Booking Information</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-primary-light mb-2">Business Hours</h4>
                  <ul className="text-neutral-300 text-sm space-y-1">
                    <li className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 7:00 PM</span></li>
                    <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 8:00 PM</span></li>
                    <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
                  </ul>
                </div>

                <div className="border-t border-neutral-700 pt-6">
                  <h4 className="font-bold text-primary-light mb-2">Cancellation Policy</h4>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    You can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges.
                  </p>
                </div>

                <div className="border-t border-neutral-700 pt-6">
                  <h4 className="font-bold text-primary-light mb-2">Need Help?</h4>
                  <p className="text-neutral-300 text-sm mb-1">Contact us at:</p>
                  <p className="text-white font-medium text-lg mb-1">(555) 123-4567</p>
                  <p className="text-primary-light text-sm">info@radiancesalon.com</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

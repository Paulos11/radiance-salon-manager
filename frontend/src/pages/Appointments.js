import React, { useState, useEffect } from 'react';
import { appointmentsAPI, reviewsAPI } from '../utils/api';
// import { useAuth } from '../context/AuthContext'; // Unused

import AppointmentCard from '../components/AppointmentCard';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    appointment: null,
    date: '',
    time: ''
  });
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    appointment: null,
    rating: 5,
    review_text: ''
  });

  // const { user } = useAuth(); // User is not used in this component

  // Actually, checking usage again. It is NOT used in the file.
  // But wait, line 28: const { user } = useAuth();
  // Is it implicitly used? No.
  // I'll leave the line but simply remove the destructuring variable if I can, or remove the line?
  // Ah, the code snippet I saw earlier showed it unused.
  // I'll remove the line entirely if it's the onlything.


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await appointmentsAPI.update(id, { status: 'cancelled' });
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Error cancelling appointment');
    }
  };

  const handleReschedule = (appointment) => {
    setRescheduleModal({
      isOpen: true,
      appointment,
      date: appointment.appointment_date.split('T')[0],
      time: appointment.appointment_time
    });
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal.date || !rescheduleModal.time) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      const response = await appointmentsAPI.update(rescheduleModal.appointment.id, {
        appointment_date: rescheduleModal.date,
        appointment_time: rescheduleModal.time
      });
      if (response.data.success) {
        toast.success('Appointment rescheduled successfully');
        setRescheduleModal({ isOpen: false, appointment: null, date: '', time: '' });
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rescheduling appointment');
    }
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({ isOpen: false, appointment: null, date: '', time: '' });
  };

  // Generate time slots (9 AM to 7 PM in 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 19 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  const handleReview = (appointment) => {
    setReviewModal({
      isOpen: true,
      appointment,
      rating: 5,
      review_text: ''
    });
  };

  const handleReviewSubmit = async () => {
    if (!reviewModal.rating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const response = await reviewsAPI.create({
        appointment_id: reviewModal.appointment.id,
        rating: reviewModal.rating,
        review_text: reviewModal.review_text
      });
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setReviewModal({ isOpen: false, appointment: null, rating: 5, review_text: '' });
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, appointment: null, rating: 5, review_text: '' });
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8 text-center">My Appointments</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-neutral-100">
            <p className="text-neutral-600 mb-6">No appointments found</p>
            <Button variant="primary" onClick={() => window.location.href = '/services'}>
              Book an Appointment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleReschedule}
                onReview={handleReview}
              />
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Reschedule Appointment</h2>
                <button 
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  onClick={closeRescheduleModal}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-sm font-medium text-primary-dark bg-primary/5 p-3 rounded-lg border border-primary/10">
                  Services: {rescheduleModal.appointment?.service_name}
                </p>
                
                <Input
                  label="New Date"
                  type="date"
                  value={rescheduleModal.date}
                  min={today}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                  containerClassName="mb-0"
                />

                <Select
                  label="New Time"
                  value={rescheduleModal.time}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                  options={[
                    { value: '', label: '-- Select time --' },
                    ...timeSlots.map(slot => ({ value: slot, label: slot }))
                  ]}
                  containerClassName="mb-0"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
                <Button variant="outline" onClick={closeRescheduleModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleRescheduleSubmit}>
                  Reschedule
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Review Modal */}
        {reviewModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Leave a Review</h2>
                <button 
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  onClick={closeReviewModal}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="text-center mb-6">
                  <p className="font-medium text-neutral-900 mb-1">{reviewModal.appointment?.service_name}</p>
                  <p className="text-sm text-neutral-500">Staff: {reviewModal.appointment?.staff_name}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2 text-center">Rating</label>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                          reviewModal.rating >= star ? 'text-warning' : 'text-neutral-300'
                        }`}
                        onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm font-medium text-primary">
                    {reviewModal.rating === 1 && 'Poor'}
                    {reviewModal.rating === 2 && 'Fair'}
                    {reviewModal.rating === 3 && 'Good'}
                    {reviewModal.rating === 4 && 'Very Good'}
                    {reviewModal.rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Your Review (Optional)</label>
                  <textarea
                    value={reviewModal.review_text}
                    onChange={(e) => setReviewModal({ ...reviewModal, review_text: e.target.value })}
                    rows="4"
                    className="block w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
                <Button variant="outline" onClick={closeReviewModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleReviewSubmit}>
                  Submit Review
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

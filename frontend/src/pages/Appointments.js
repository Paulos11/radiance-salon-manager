import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';
import { toast } from 'react-toastify';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { user } = useAuth();

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

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filter);

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
    <div className="page appointments-page">
      <div className="container">
        <h1 className="page-title">My Appointments</h1>

        <div className="appointments-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found</p>
            <a href="/services" className="btn btn-primary">
              Book an Appointment
            </a>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

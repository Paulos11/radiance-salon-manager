import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, servicesAPI } from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'customer') {
        const response = await appointmentsAPI.getUpcoming();
        if (response.data.success) {
          setUpcomingAppointments(response.data.data);
        }
      }

      const allAppts = await appointmentsAPI.getAll();
      if (allAppts.data.success) {
        const appointments = allAppts.data.data;
        setStats({
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter(a => a.status === 'pending').length,
          completedAppointments: appointments.filter(a => a.status === 'completed').length
        });
      }
    } catch (error) {
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="page dashboard-page">
      <div className="container">
        <h1 className="page-title">
          Welcome back, {user.full_name}!
        </h1>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.totalAppointments}</h3>
              <p>Total Appointments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingAppointments}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completedAppointments}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/appointments" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming appointments</p>
              <Link to="/services" className="btn btn-primary">
                Book an Appointment
              </Link>
            </div>
          ) : (
            <div className="appointments-grid">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <Link to="/services" className="action-card">
            <div className="action-icon">💇</div>
            <h3>Browse Services</h3>
            <p>Explore our wide range of beauty services</p>
          </Link>

          <Link to="/appointments" className="action-card">
            <div className="action-icon">📋</div>
            <h3>My Appointments</h3>
            <p>View and manage your appointments</p>
          </Link>

          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your personal information</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

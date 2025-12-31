import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../utils/api';
import AppointmentCard from '../components/AppointmentCard';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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

    fetchDashboardData();
  }, [user.role]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Welcome back, {user.full_name}!
          </h1>
          <p className="mt-2 text-neutral-600">Here's an overview of your beauty journey with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="flex items-center p-6 bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-primary/10 text-2xl mr-4">📅</div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{stats.totalAppointments}</h3>
              <p className="text-sm text-neutral-500 font-medium">Total Appointments</p>
            </div>
          </Card>

          <Card className="flex items-center p-6 bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-warning/10 text-2xl mr-4">⏳</div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{stats.pendingAppointments}</h3>
              <p className="text-sm text-neutral-500 font-medium">Pending</p>
            </div>
          </Card>

          <Card className="flex items-center p-6 bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-success/10 text-2xl mr-4">✅</div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{stats.completedAppointments}</h3>
              <p className="text-sm text-neutral-500 font-medium">Completed</p>
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Upcoming Appointments</h2>
            <Link to="/appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-lg text-neutral-600 mb-6">No upcoming appointments scheduled.</p>
              <Link to="/services">
                <Button variant="primary">Book an Appointment</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/services" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group-hover:-translate-y-1">
              <div className="text-4xl mb-4 text-primary">💇</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">Browse Services</h3>
              <p className="text-neutral-600 text-sm">Explore our wide range of beauty services and find your perfect treatment.</p>
            </Card>
          </Link>

          <Link to="/appointments" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary group-hover:-translate-y-1">
              <div className="text-4xl mb-4 text-secondary">📋</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-secondary transition-colors">My Appointments</h3>
              <p className="text-neutral-600 text-sm">View your booking history, manage upcoming visits, and reschedule if needed.</p>
            </Card>
          </Link>

          <Link to="/profile" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-neutral-400 group-hover:-translate-y-1">
              <div className="text-4xl mb-4 text-neutral-400">👤</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">My Profile</h3>
              <p className="text-neutral-600 text-sm">Update your personal information, contact details, and preferences.</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

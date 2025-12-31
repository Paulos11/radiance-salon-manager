import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingAppointments: 0
  });

  // Services state
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    duration_minutes: '',
    price: '',
    category: '',
    is_active: true
  });
  const [editingService, setEditingService] = useState(null);

  // Staff state
  const [staff, setStaff] = useState([]);
  const [staffForm, setStaffForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    experience_years: '',
    bio: '',
    is_available: true
  });
  const [editingStaff, setEditingStaff] = useState(null);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  // Check admin access
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load initial data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardStats();
    } else if (activeTab === 'services') {
      loadServices();
    } else if (activeTab === 'staff') {
      loadStaff();
    } else if (activeTab === 'appointments') {
      loadAppointments();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      const [appointmentsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/services'),
        api.get('/staff')
      ]);

      const allAppointments = appointmentsRes.data.data || appointmentsRes.data || [];
      const pending = allAppointments.filter(a => a.status === 'pending').length;
      const completed = allAppointments.filter(a => a.status === 'completed');

      // Calculate revenue from completed appointments
      const revenue = completed.reduce((sum, apt) => {
        return sum + (parseFloat(apt.price) || 0);
      }, 0);

      // Count unique customers
      const uniqueCustomers = new Set(allAppointments.map(a => a.customer_id)).size;

      setStats({
        totalAppointments: allAppointments.length,
        totalCustomers: uniqueCustomers,
        totalRevenue: revenue,
        pendingAppointments: pending
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const loadStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load staff');
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
    }
  };

  // Service handlers
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, serviceForm);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', serviceForm);
        toast.success('Service created successfully');
      }
      resetServiceForm();
      loadServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      service_name: service.service_name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      category: service.category,
      is_active: service.is_active
    });
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        toast.success('Service deleted successfully');
        loadServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      service_name: '',
      description: '',
      duration_minutes: '',
      price: '',
      category: '',
      is_active: true
    });
    setEditingService(null);
  };

  // Staff handlers
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const { password, ...updateData } = staffForm;
        await api.put(`/staff/${editingStaff.id}`, updateData);
        toast.success('Staff updated successfully');
      } else {
        await api.post('/staff', staffForm);
        toast.success('Staff member created successfully');
      }
      resetStaffForm();
      loadStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save staff member');
    }
  };

  const handleEditStaff = (member) => {
    setEditingStaff(member);
    setStaffForm({
      full_name: member.full_name,
      email: member.email,
      password: '',
      phone: member.phone,
      specialization: member.specialization,
      experience_years: member.experience_years,
      bio: member.bio || '',
      is_available: member.is_available
    });
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${id}`);
        toast.success('Staff member deleted successfully');
        loadStaff();
      } catch (error) {
        toast.error('Failed to delete staff member');
      }
    }
  };

  const resetStaffForm = () => {
    setStaffForm({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      experience_years: '',
      bio: '',
      is_available: true
    });
    setEditingStaff(null);
  };

  // Appointment handlers
  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      loadAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointmentFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === appointmentFilter);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center pt-10">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">Admin Panel</h1>
          <p className="mt-2 text-neutral-600">Manage your salon operations</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 border-b border-neutral-200">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'services'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'staff'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('staff')}
          >
            Staff
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'appointments'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
        </div>

        <div className="space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary/10 text-2xl mr-4">📅</div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{stats.totalAppointments}</h3>
                    <p className="text-sm text-neutral-500">Total Appointments</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-secondary/10 text-2xl mr-4">👥</div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{stats.totalCustomers}</h3>
                    <p className="text-sm text-neutral-500">Total Customers</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-success/10 text-2xl mr-4">💰</div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">₹{stats.totalRevenue.toFixed(2)}</h3>
                    <p className="text-sm text-neutral-500">Total Revenue</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-warning/10 text-2xl mr-4">⏳</div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{stats.pendingAppointments}</h3>
                    <p className="text-sm text-neutral-500">Pending</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-xl font-bold mb-6">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <Input
                      label="Service Name *"
                      type="text"
                      value={serviceForm.service_name}
                      onChange={(e) => setServiceForm({ ...serviceForm, service_name: e.target.value })}
                      required
                    />
                    <Input
                      label="Category *"
                      type="text"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      required
                    />
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        rows="3"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Duration (min) *"
                        type="number"
                        value={serviceForm.duration_minutes}
                        onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                        min="1"
                        required
                        containerClassName="mb-0"
                      />
                      <Input
                        label="Price (₹) *"
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        min="0"
                        required
                        containerClassName="mb-0"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={serviceForm.is_active}
                        onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                    <div className="flex gap-2">
                      {editingService && (
                        <Button type="button" variant="outline" onClick={resetServiceForm} className="flex-1">
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="primary" className="flex-1">
                        {editingService ? 'Update' : 'Add Service'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold">All Services ({services.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                  {services.map(service => (
                    <Card key={service.id} className="flex flex-col sm:flex-row justify-between p-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{service.service_name}</h3>
                          <Badge variant={service.is_active ? 'success' : 'danger'}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{service.description}</p>
                        <div className="flex gap-4 text-sm text-neutral-500">
                          <span>📁 {service.category}</span>
                          <span>⏱ {service.duration_minutes} min</span>
                          <span>💰 ₹{service.price}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteService(service.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-xl font-bold mb-6">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h2>
                  <form onSubmit={handleStaffSubmit} className="space-y-4">
                    <Input
                      label="Full Name *"
                      type="text"
                      value={staffForm.full_name}
                      onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      required
                    />
                    <Input
                      label={editingStaff ? 'Password (leave blank to keep current)' : 'Password *'}
                      type="password"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      required={!editingStaff}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Phone *"
                        type="tel"
                        value={staffForm.phone}
                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                        required
                        containerClassName="mb-0"
                      />
                       <Input
                        label="Exp (years) *"
                        type="number"
                        value={staffForm.experience_years}
                        onChange={(e) => setStaffForm({ ...staffForm, experience_years: e.target.value })}
                        min="0"
                        required
                        containerClassName="mb-0"
                      />
                    </div>
                    <Input
                      label="Specialization *"
                      type="text"
                      value={staffForm.specialization}
                      onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                      required
                    />
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={staffForm.bio}
                        onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                        rows="3"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_available"
                        checked={staffForm.is_available}
                        onChange={(e) => setStaffForm({ ...staffForm, is_available: e.target.checked })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                        Available
                      </label>
                    </div>
                    <div className="flex gap-2">
                       {editingStaff && (
                        <Button type="button" variant="outline" onClick={resetStaffForm} className="flex-1">
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="primary" className="flex-1">
                        {editingStaff ? 'Update' : 'Add Staff'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold">All Staff ({staff.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                  {staff.map(member => (
                    <Card key={member.id} className="flex flex-col sm:flex-row justify-between p-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{member.full_name}</h3>
                          <Badge variant={member.is_available ? 'success' : 'danger'}>
                            {member.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{member.bio || 'No bio provided'}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-500">
                          <span>📧 {member.email}</span>
                          <span>📱 {member.phone}</span>
                          <span>✂️ {member.specialization}</span>
                          <span>🎓 {member.experience_years} years exp</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEditStaff(member)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteStaff(member.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold">All Appointments ({appointments.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(filter => (
                    <Button
                      key={filter}
                      size="sm"
                      variant={appointmentFilter === filter ? 'primary' : 'outline'}
                      onClick={() => setAppointmentFilter(filter)}
                      className="capitalize"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Staff</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAppointments.map(appointment => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">{appointment.service_name}</TableCell>
                                    <TableCell>
                                        <div>{appointment.customer_name}</div>
                                        {appointment.notes && <div className="text-xs text-neutral-500 truncate max-w-[150px]">{appointment.notes}</div>}
                                    </TableCell>
                                    <TableCell>{appointment.staff_name}</TableCell>
                                    <TableCell>
                                        <div>{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                                        <div className="text-xs text-neutral-500">{appointment.appointment_time}</div>
                                    </TableCell>
                                    <TableCell>₹{appointment.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            appointment.status === 'confirmed' ? 'success' :
                                            appointment.status === 'pending' ? 'warning' :
                                            appointment.status === 'completed' ? 'primary' :
                                            'danger'
                                        }>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {appointment.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="success" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}>
                                                        Confirm
                                                    </Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}>
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {appointment.status === 'confirmed' && (
                                                <>
                                                    <Button size="sm" variant="primary" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}>
                                                        Complete
                                                    </Button>
                                                    <Button size="sm" variant="warning" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'no-show')}>
                                                        No Show
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

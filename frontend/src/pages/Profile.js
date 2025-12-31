import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || ''
      });
      loadAppointmentHistory();
    }
  }, [user]);

  const loadAppointmentHistory = async () => {
    try {
      const response = await api.get('/appointments');
      const allAppointments = response.data.data || response.data || [];
      // Get last 5 appointments
      const sorted = allAppointments.sort((a, b) =>
        new Date(b.appointment_date) - new Date(a.appointment_date)
      );
      setAppointments(sorted.slice(0, 5));
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', profileData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || ''
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    const statusVariants = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'primary',
      cancelled: 'danger',
      'no-show': 'danger'
    };
    return statusVariants[status] || 'neutral';
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-neutral-100">
          <div className="flex-shrink-0">
             <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-serif font-bold shadow-md">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-grow text-center md:text-left space-y-2">
            <h1 className="text-3xl font-serif font-bold text-neutral-900">{user.full_name}</h1>
            <Badge variant="primary" className="capitalize">
              {user.role}
            </Badge>
            <p className="text-neutral-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Profile Information</h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleProfileChange}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />

                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />

                {user.role === 'customer' && (
                  <>
                    <Input
                      label="Date of Birth"
                      type="date"
                      name="date_of_birth"
                      value={profileData.date_of_birth}
                      onChange={handleProfileChange}
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-neutral-700">Address</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        rows="3"
                        className="block w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={cancelEdit} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                   <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Full Name</span>
                   <span className="text-neutral-900 font-medium">{user.full_name}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                   <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Email</span>
                   <span className="text-neutral-900 font-medium">{user.email}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                   <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Phone</span>
                   <span className="text-neutral-900 font-medium">{user.phone || 'Not provided'}</span>
                </div>
                {user.role === 'customer' && (
                  <>
                    <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                       <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Date of Birth</span>
                      <span className="text-neutral-900 font-medium">
                        {user.date_of_birth
                          ? new Date(user.date_of_birth).toLocaleDateString()
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                       <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Address</span>
                       <span className="text-neutral-900 font-medium">{user.address || 'Not provided'}</span>
                    </div>
                  </>
                )}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                   <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Account Created</span>
                  <span className="text-neutral-900 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Change Password Card */}
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Security</h2>
              {!isChangingPassword && (
                <Button onClick={() => setIsChangingPassword(true)} variant="outline" size="sm">
                  Change Password
                </Button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  error={passwordData.newPassword.length > 0 && passwordData.newPassword.length < 6 ? "Password must be at least 6 characters" : ""}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? "Passwords do not match" : ""}
                />

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={loading}>
                    Change Password
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-100">
                <p className="text-neutral-600 mb-4">Keep your account secure by using a strong password and changing it regularly.</p>
                <div className="bg-white p-4 rounded border border-neutral-200">
                  <h4 className="font-bold text-neutral-900 mb-2">Password Tips:</h4>
                  <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                    <li>Use at least 6 characters</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Add numbers and special characters</li>
                    <li>Avoid common words or personal information</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Appointments Card */}
        {user.role === 'customer' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Recent Appointments</h2>
            </div>
            {appointments.length === 0 ? (
              <p className="text-neutral-600 text-center py-8">No appointments yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map(appointment => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.service_name}</TableCell>
                      <TableCell>{new Date(appointment.appointment_date).toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.appointment_time}</TableCell>
                      <TableCell>{appointment.staff_name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;

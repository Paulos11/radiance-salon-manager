import React from 'react';
import { format } from 'date-fns';
import './AppointmentCard.css';

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
      'no-show': 'badge-cancelled'
    };
    return statusClasses[status] || 'badge-pending';
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'hh:mm a');
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div>
          <h3 className="appointment-service">{appointment.service_name}</h3>
          <span className={`badge ${getStatusClass(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        <div className="appointment-price">₹{appointment.price}</div>
      </div>

      <div className="appointment-details">
        <div className="appointment-detail">
          <span className="detail-icon">📅</span>
          <div>
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(appointment.appointment_date)}</span>
          </div>
        </div>

        <div className="appointment-detail">
          <span className="detail-icon">🕐</span>
          <div>
            <span className="detail-label">Time</span>
            <span className="detail-value">{formatTime(appointment.appointment_time)}</span>
          </div>
        </div>

        <div className="appointment-detail">
          <span className="detail-icon">💇</span>
          <div>
            <span className="detail-label">Staff</span>
            <span className="detail-value">{appointment.staff_name}</span>
          </div>
        </div>

        {appointment.customer_name && (
          <div className="appointment-detail">
            <span className="detail-icon">👤</span>
            <div>
              <span className="detail-label">Customer</span>
              <span className="detail-value">{appointment.customer_name}</span>
            </div>
          </div>
        )}
      </div>

      {appointment.notes && (
        <div className="appointment-notes">
          <strong>Notes:</strong> {appointment.notes}
        </div>
      )}

      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
        <div className="appointment-actions">
          {onReschedule && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onReschedule(appointment)}
            >
              Reschedule
            </button>
          )}
          {onCancel && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;

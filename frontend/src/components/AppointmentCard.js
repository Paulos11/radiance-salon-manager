import React from 'react';
import { format } from 'date-fns';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const AppointmentCard = ({ appointment, onCancel, onReschedule, onReview }) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">{appointment.service_name}</h3>
          <Badge variant={getStatusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
        <div className="text-lg font-bold text-primary">₹{appointment.price}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-neutral-600">
          <span className="mr-2 text-lg">📅</span>
          <div>
            <span className="block text-xs text-neutral-400">Date</span>
            <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-neutral-600">
          <span className="mr-2 text-lg">🕐</span>
          <div>
            <span className="block text-xs text-neutral-400">Time</span>
            <span className="font-medium">{formatTime(appointment.appointment_time)}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-neutral-600">
          <span className="mr-2 text-lg">💇</span>
          <div>
            <span className="block text-xs text-neutral-400">Staff</span>
            <span className="font-medium">{appointment.staff_name}</span>
          </div>
        </div>

        {appointment.customer_name && (
          <div className="flex items-center text-sm text-neutral-600">
            <span className="mr-2 text-lg">👤</span>
            <div>
              <span className="block text-xs text-neutral-400">Customer</span>
              <span className="font-medium">{appointment.customer_name}</span>
            </div>
          </div>
        )}
      </div>

      {appointment.notes && (
        <div className="bg-neutral-50 p-3 rounded-lg text-sm text-neutral-600 mb-4 border border-neutral-100">
          <strong className="text-neutral-900">Notes:</strong> {appointment.notes}
        </div>
      )}

      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'no-show' && (
        <div className="flex gap-2 justify-end mt-2 pt-4 border-t border-neutral-100">
          {onReschedule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule(appointment)}
            >
              Reschedule
            </Button>
          )}
          {onCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}

      {appointment.status === 'completed' && onReview && !appointment.has_review && (
        <div className="flex justify-end mt-2 pt-4 border-t border-neutral-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onReview(appointment)}
          >
            ⭐ Leave a Review
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;

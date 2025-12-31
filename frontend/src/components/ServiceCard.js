import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';

const ServiceCard = ({ service, onBook }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-neutral-900 line-clamp-2">{service.service_name}</h3>
        <Badge variant="primary">{service.category}</Badge>
      </div>

      <p className="text-neutral-600 text-sm mb-6 flex-grow line-clamp-3">
        {service.description}
      </p>

      <div className="border-t border-neutral-100 pt-4 mt-auto">
        <div className="flex justify-between items-center mb-4 text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{service.duration_minutes} min</span>
          </div>
          <span className="text-lg font-bold text-primary">₹{service.price}</span>
        </div>

        {onBook && (
          <Button 
            variant="primary" 
            className="w-full shadow-sm" 
            onClick={() => onBook(service)}
          >
            Book Now
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;

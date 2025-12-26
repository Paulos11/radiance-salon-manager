import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <h3 className="service-name">{service.service_name}</h3>
        <span className="service-category">{service.category}</span>
      </div>

      <p className="service-description">{service.description}</p>

      <div className="service-details">
        <div className="service-detail">
          <span className="detail-label">Duration:</span>
          <span className="detail-value">{service.duration_minutes} min</span>
        </div>
        <div className="service-detail">
          <span className="detail-label">Price:</span>
          <span className="detail-value price">₹{service.price}</span>
        </div>
      </div>

      {onBook && (
        <button className="btn btn-primary btn-block" onClick={() => onBook(service)}>
          Book Now
        </button>
      )}
    </div>
  );
};

export default ServiceCard;

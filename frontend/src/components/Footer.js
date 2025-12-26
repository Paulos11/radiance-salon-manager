import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Radiance Salon Manager</h3>
            <p className="footer-description">
              Professional beauty salon booking and management system designed for modern salons.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/services">Services</a></li>
              <li><a href="/appointments">Book Appointment</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@radiancesalon.com</p>
            <p>Phone: +1 234 567 8900</p>
            <p>Address: 123 Beauty Street, City</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Radiance Salon Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

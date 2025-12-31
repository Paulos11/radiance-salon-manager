import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-lg font-serif font-bold mb-4">Radiance Salon</h3>
            <p className="text-sm leading-relaxed mb-4">
              Premium beauty services tailored to your unique style. Experience luxury and care in every visit.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-primary-light transition-colors">Services</Link></li>
              <li><Link to="/login" className="hover:text-primary-light transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary-light transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Hair Styling</span></li>
              <li><span className="cursor-default">Facials</span></li>
              <li><span className="cursor-default">Manicure & Pedicure</span></li>
              <li><span className="cursor-default">Massage Therapy</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>123 Beauty Lane, Cityville</span>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-primary-light transition-colors">+1 (234) 567-890</a>
              </li>
              <li>
                <a href="mailto:info@radiancesalon.com" className="hover:text-primary-light transition-colors">info@radiancesalon.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>&copy; {currentYear} Radiance Salon Manager. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

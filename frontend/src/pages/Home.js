import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Radiance Salon Manager</h1>
            <p className="hero-subtitle">
              Experience beauty and elegance with our professional salon services.
              Book your appointment today and let us help you shine.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  <Link to="/services" className="btn btn-primary btn-large">
                    Browse Services
                  </Link>
                  <Link to="/appointments" className="btn btn-secondary btn-large">
                    My Appointments
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/services" className="btn btn-outline btn-large">
                    View Services
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💇</div>
              <h3>Expert Stylists</h3>
              <p>Our team of experienced professionals are dedicated to making you look your best.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Schedule appointments online at your convenience, 24/7.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Services</h3>
              <p>Wide range of beauty treatments and services to meet all your needs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Care</h3>
              <p>Customized treatments tailored to your unique style and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Look?</h2>
          <p>Book your appointment today and experience the Radiance difference</p>
          <Link to={isAuthenticated ? '/services' : '/register'} className="btn btn-primary btn-large">
            {isAuthenticated ? 'Book Now' : 'Sign Up Now'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

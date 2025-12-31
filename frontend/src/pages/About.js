import React from 'react';
import Card from '../components/ui/Card';

const About = () => {
  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-6 text-center">About Radiance Salon</h1>
        <Card>
          <div className="prose prose-lg max-w-none text-neutral-600">
            <p>
              Welcome to Radiance Salon, where beauty meets elegance. Since our establishment, we have been dedicated to providing top-tier beauty and wellness services to our valued clients.
            </p>
            <p>
              Our team of expert stylists and therapists are passionate about their craft and committed to helping you look and feel your absolute best. We use only the finest products and stay updated with the latest trends and techniques in the industry.
            </p>
            <h3>Our Mission</h3>
            <p>
              To provide a luxurious and relaxing environment where our clients can escape the stresses of daily life and indulge in self-care.
            </p>
            <h3>Our Team</h3>
            <p>
              We are proud to have a diverse team of skilled professionals who specialize in various aspects of beauty, from hair styling and coloring to skincare and massage therapy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;

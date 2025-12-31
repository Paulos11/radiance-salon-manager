import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for contact form submission logic
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">Contact Us</h1>
          <p className="mt-2 text-neutral-600">We'd love to hear from you. Get in touch with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="h-full bg-neutral-900 text-white border-none">
              <h3 className="text-xl font-bold mb-6 text-primary-light">Get in Touch</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-white mb-2">Visit Us</h4>
                  <p className="text-neutral-400">123 Beauty Lane</p>
                  <p className="text-neutral-400">Cityville, ST 12345</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Call Us</h4>
                  <p className="text-neutral-400">+1 (234) 567-890</p>
                  <p className="text-neutral-400">Mon-Sat: 9am - 7pm</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Email Us</h4>
                  <p className="text-neutral-400">info@radiancesalon.com</p>
                  <p className="text-neutral-400">support@radiancesalon.com</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Name"
                  type="text"
                  placeholder="Your Name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Your Email"
                  required
                />
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="4"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

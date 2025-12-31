import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 border-b border-white/10 overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
            Elevate Your <span className="text-primary-light">Radiance</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed font-light">
            Experience premium beauty and elegance. Our expert stylists are dedicated to crafting your perfect look in a luxurious environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/services">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow">
                    Browse Services
                  </Button>
                </Link>
                <Link to="/appointments">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-neutral-900">
                    My Appointments
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow">
                    Get Started
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-neutral-900">
                    View Services
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">Why Choose Radiance</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
              We combine artistic excellence with premium care to ensure you leave looking and feeling your absolute best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                💇
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Expert Stylists</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our team of experienced professionals are dedicated to making you look your best.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Easy Booking</h3>
              <p className="text-neutral-600 leading-relaxed">
                Schedule appointments online at your convenience, 24/7 with our easy system.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Premium Services</h3>
              <p className="text-neutral-600 leading-relaxed">
                Wide range of beauty treatments and customized services to meet all your needs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Personalized Care</h3>
              <p className="text-neutral-600 leading-relaxed">
                Customized treatments tailored specifically to your unique style and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-12186d30b7e2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Ready to Transform Your Look?</h2>
          <p className="text-neutral-300 text-lg mb-10 max-w-2xl mx-auto">
            Book your appointment today and experience the Radiance difference. Your journey to beauty starts here.
          </p>
          <Link to={isAuthenticated ? '/services' : '/register'}>
            <Button variant="primary" size="lg" className="shadow-glow px-8 py-4 text-lg">
              {isAuthenticated ? 'Book Now' : 'Sign Up Now'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

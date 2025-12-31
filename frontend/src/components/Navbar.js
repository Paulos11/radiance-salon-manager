import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={closeMenu}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'text-primary bg-primary-light/10'
          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={closeMenu}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive(to)
          ? 'text-primary bg-primary-light/10'
          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-serif font-bold text-xl">
                R
              </div>
              <span className={`font-serif font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                Radiance
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/appointments">Appointments</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin">Admin</NavLink>
                )}
                <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/services">Services</NavLink>
                <div className="ml-4 flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">Register</Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
                <MobileNavLink to="/services">Services</MobileNavLink>
                <MobileNavLink to="/appointments">Appointments</MobileNavLink>
                <MobileNavLink to="/profile">Profile</MobileNavLink>
                {user?.role === 'admin' && (
                  <MobileNavLink to="/admin">Admin</MobileNavLink>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{user?.full_name}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/services">Services</MobileNavLink>
                <div className="pt-4 pb-2 border-t border-gray-100 flex flex-col gap-2 px-3">
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="primary" className="w-full justify-center">Register</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

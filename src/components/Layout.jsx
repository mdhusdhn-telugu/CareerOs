// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { IoRocketOutline, IoMenu, IoClose } from 'react-icons/io5'; // Restored Outline Icon
import Footer from './Footer/Footer';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const navItems = [
  { path: '/resume', label: 'Resume' },
  { path: '/compiler', label: 'Compiler' },
  { path: '/jobs', label: 'Jobs' },
  { path: '/interview', label: 'Interview' },
  { path: '/aptitude', label: 'Aptitude' },
  { path: '/mnc-prep', label: 'MNC Prep' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/typing-test', label: 'Typing' },
];

const Layout = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const profileText = user?.displayName ? user.displayName.split(' ')[0] : 'Profile';

  return (
    <div className="app-container">
      <header className={`navbar ${isMobileMenuOpen ? 'nav-open' : ''}`}>
        
        {/* LEFT SIDE: Original Logo Preserved */}
        <Link to="/" className="logo-link">
          <IoRocketOutline className="rocket-icon" /> 
          <span className="code-logo">Code</span>
          <span className="astra-logo">Astra</span>
        </Link>

        {/* RIGHT SIDE: Navigation + Profile + Toggle */}
        <div className="nav-right-group">
          
          {/* Desktop Links */}
          <nav className="nav-links desktop-only">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Button */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'profile-btn active' : 'profile-btn'
            }
          >
            {profileText}
          </NavLink>

          {/* Mobile Toggle (Hamburger) */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown (Absolute Positioned) */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'mobile-link active' : 'mobile-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
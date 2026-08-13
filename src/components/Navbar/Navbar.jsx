import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import { IoRocketOutline } from 'react-icons/io5';
import './Navbar.css'; // We will create this CSS file next

const Navbar = () => {
  const { user } = useAuth();

  // Get the user's first name, or fallback to 'Profile'
  const profileText = user?.displayName ? user.displayName.split(' ')[0] : 'Profile';

  return (
    <header className="navbar">
      <a href="/" className="logo-link">
        <IoRocketOutline className="rocket-icon" />
        <span className="code-logo">Code</span>
        <span className="astra-logo">Astra</span>
      </a>
      {user ? (
        <a href="/profile" className="cta-button premium">{profileText}</a>
      ) : (
        <a href="/login" className="cta-button premium">Login</a>
      )}
    </header>
  );
};

export default Navbar;
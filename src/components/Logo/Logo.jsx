// src/components/Logo/Logo.jsx
//
// Shared brand logo — previously this exact JSX (rocket icon + "Code"/"Astra"
// gradient text) was duplicated in both Layout.jsx (the protected-app navbar)
// and Navbar.jsx (the public-page navbar). Extracting it here means the logo
// only needs to be changed in one place.
import React from 'react';
import { Link } from 'react-router-dom';
import { IoRocketOutline } from 'react-icons/io5';
import './Logo.css';

const Logo = () => (
  <Link to="/" className="logo-link">
    <IoRocketOutline className="rocket-icon" />
    <span className="code-logo">Code</span>
    <span className="astra-logo">Astra</span>
  </Link>
);

export default Logo;
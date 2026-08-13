// src/components/Footer/Footer.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoRocketOutline, IoLogoTwitter, IoLogoLinkedin, IoLogoInstagram } from 'react-icons/io5';
import QuoteOfTheDay from '../QuoteOfTheDay/QuoteOfTheDay.jsx';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <IoRocketOutline className="footer-rocket-icon" />
              <span className="footer-code-logo">Code</span>
              <span className="footer-astra-logo">Astra</span>
            </div>
            <p>Your all-in-one platform for student success and career advancement.</p>
            <div className="social-links">
              <a href="https://x.com/mdhusdhn?fbclid=PAT01DUANMqclleHRuA2FlbQIxMAABpwMspOhZ8y28Vdha9ImtVh407IJG0K9jwrNXKCeW9B4K5lM46iPLygK_ez_N_aem_xtzX1G_a2BDjdwfEkp_SXg" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><IoLogoTwitter /></a>
              <a href="https://www.linkedin.com/in/madhusudhantelugu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IoLogoLinkedin /></a>
              <a href="https://www.instagram.com/mdhusdhn.telugu?igsh=MTNsZTV0MnBvZGRncA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IoLogoInstagram /></a>
            </div>
          </div>
          <div className="footer-links-container">
            <div className="footer-links-column">
              <h4>Features</h4>
              <ul>
                <li><Link to="/resume" aria-label="Navigate to Resume Builder">Resume Builder</Link></li>
                <li><Link to="/jobs">Job Postings</Link></li>
                <li><Link to="/compiler">Online Compiler</Link></li>
                <li><Link to="/typing-test">Typing Test</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/guides">Guides</Link></li>
                {location.pathname === '/faq' ? (
                  <li><span className="footer-link-active">FAQ</span></li>
                ) : (
                  <li><Link to="/faq">FAQ</Link></li>
                )}
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <div className="footer-quote">
            <QuoteOfTheDay />
          </div>
          <p className="copyright">© 2026 CodeAstra by Madhu Sudhan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
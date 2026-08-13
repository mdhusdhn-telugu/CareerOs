// src/components/Contact/Contact.jsx

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, 
  FaSpinner, FaCheckCircle, FaTimesCircle, FaCopy, 
  FaExternalLinkAlt, FaGithub, FaLinkedin, FaTwitter 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene'; 
import './Contact.css';

const Contact = () => {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormValues(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setStatus({ message: `${type} copied!`, type: 'success' });
    setTimeout(() => setStatus({ message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // Ensure these match your .env variables exactly
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; 
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.send(serviceID, templateID, formValues, publicKey)
      .then(() => {
          setStatus({ message: 'Message sent successfully!', type: 'success' });
          setFormValues({ name: '', email: '', message: '' });
      })
      .catch((err) => {
          setStatus({ message: 'Failed to send. Please try again.', type: 'error' });
      })
      .finally(() => setIsSending(false));
  };

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <main className="contact-main">
          <motion.div 
            className="contact-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            <div className="contact-header-center">
              <span className="badge-pill">24/7 Support</span>
              <h1>Get in <span className="text-gradient">Touch</span></h1>
              <p>Have questions about CodeAstra? We're here to help.</p>
            </div>

            <div className="glass-panel-wrapper">
              
              {/* Left Side: Contact Details */}
              <div className="contact-details">
                <h3>Contact Information</h3>
                <p className="details-sub">
                  Click the <b>Icon</b> to open. Click the <b>Text</b> to copy.
                </p>

                <div className="info-stack">
                  
                  {/* ITEM 1: EMAIL */}
                  <div className="info-item">
                    <a href="mailto:mdhusdhn.telugu@gmail.com" className="icon-box action-zone" title="Open Mail App">
                      <FaEnvelope />
                    </a>
                    <div className="info-text copy-zone" onClick={() => copyToClipboard('mdhusdhn.telugu@gmail.com', 'Email')} title="Click to Copy">
                      <label>Email Support</label>
                      <span>mdhusdhn.telugu@gmail.com</span>
                    </div>
                    <div className="copy-indicator"><FaCopy /></div>
                  </div>

                  {/* ITEM 2: PHONE */}
                  <div className="info-item">
                    <a href="tel:+918688381084" className="icon-box action-zone" title="Call Now">
                      <FaPhone />
                    </a>
                    <div className="info-text copy-zone" onClick={() => copyToClipboard('+918688381084', 'Number')} title="Click to Copy">
                      <label>Phone Number</label>
                      <span>+91 86883 81084</span>
                    </div>
                    <div className="copy-indicator"><FaCopy /></div>
                  </div>

                  {/* ITEM 3: MAPS */}
                  <div className="info-item">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Nandyal+Andhra+Pradesh" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="icon-box action-zone" 
                      title="Open Google Maps"
                    >
                      <FaMapMarkerAlt />
                    </a>
                    <div className="info-text copy-zone" onClick={() => copyToClipboard('Nandyal, Andhra Pradesh, India', 'Address')} title="Click to Copy">
                      <label>Location</label>
                      <span>Nandyal, Andhra Pradesh</span>
                    </div>
                    <div className="copy-indicator"><FaCopy /></div>
                  </div>

                </div>

                <div className="social-row">
                  <p>Follow Us:</p>
                  <div className="social-icons">
                    <a href="#" target="_blank"><FaGithub /></a>
                    <a href="#" target="_blank"><FaLinkedin /></a>
                    <a href="#" target="_blank"><FaTwitter /></a>
                  </div>
                </div>
              </div>

              {/* Right Side: Form Area - FULLY RESTORED */}
              <div className="contact-form-area">
                <form onSubmit={sendEmail}>
                  <div className="input-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Madhu Sudhan"
                      value={formValues.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="e.g. student@codeastra.com"
                      value={formValues.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label>Message</label>
                    <textarea 
                      name="message" 
                      placeholder="How can we help you?"
                      rows="5"
                      value={formValues.message} 
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSending}>
                    {isSending ? <FaSpinner className="spin" /> : <>Send Message <FaPaperPlane /></>}
                  </button>

                  {status.message && (
                    <div className={`status-msg ${status.type}`}>
                      {status.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                      {status.message}
                    </div>
                  )}
                </form>
              </div>

            </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;
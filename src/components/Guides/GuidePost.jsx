import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { guidesContent } from './guidesData';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene';
import './GuidePost.css';

const GuidePost = () => {
  const { id } = useParams();
  // Find the guide that matches the ID from URL
  const guide = guidesContent.find(g => g.id === parseInt(id));

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!guide) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
        <h2>Guide not found.</h2>
        <Link to="/guides" style={{ color: '#a855f7' }}>Return to Guides</Link>
      </div>
    );
  }

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <div className="guide-post-container">
          <Link to="/guides" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Knowledge Base
          </Link>

          <motion.article 
            className="guide-article"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <header className="guide-header">
              <span className="guide-tag">{guide.tag}</span>
              <h1 className="guide-title">{guide.title}</h1>
              <div className="guide-meta-info">
                <span>{guide.date}</span>
                <span className="dot">•</span>
                <span>{guide.readTime}</span>
              </div>
            </header>

            {/* The Content */}
            <div 
              className="guide-body"
              dangerouslySetInnerHTML={{ __html: guide.content }} 
            />
          </motion.article>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default GuidePost;
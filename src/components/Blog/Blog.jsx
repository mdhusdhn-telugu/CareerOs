import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from './blogData';
import Navbar from '../Navbar/Navbar'; 
import Footer from '../Footer/Footer'; 
import Scene from '../Homepage/Scene'; // Starfield background
import './Blog.css';

const Blog = () => {
  // 1. Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. THE BULB EFFECT LOGIC
  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("blog-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Send the coordinates to CSS
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        {/* Attach the mouse tracker here */}
        <main className="blog-main" onMouseMove={handleMouseMove}>
          
          {/* HERO SECTION */}
          <section className="blog-hero">
            <div className="hero-glow-effect"></div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Engineering <span className="highlight-text">Insights</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Deep dives into algorithms, system design, and career growth.
            </motion.p>
          </section>

          {/* BLOG GRID */}
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <Link to={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                <motion.article 
                  className="blog-card" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} // Force visible immediately
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card-content">
                    <div className="blog-tags">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                    
                    <h2>{post.title}</h2>
                    <p className="excerpt">{post.excerpt}</p>
                    
                    <div className="card-footer">
                      <span className="meta-date">{post.date}</span>
                      <span className="read-arrow">Read Article →</span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
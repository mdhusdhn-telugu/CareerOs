import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene';
import './Guides.css';

const Guides = () => {
  
  // 1. Scroll to top on load to fix the "middle of page" issue
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. Mouse tracking for the glow effect
  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("guide-card-item");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  const guidesData = [
    {
      category: "Career Roadmaps",
      items: [
        { id: 1, title: "The 2025 Full Stack Roadmap", readTime: "8 min", tag: "Roadmap", icon: "fa-map-signs" },
        { id: 2, title: "Frontend vs Backend: The Choice", readTime: "5 min", tag: "Career", icon: "fa-balance-scale" },
        { id: 3, title: "From BCA to Your First Job", readTime: "6 min", tag: "Planning", icon: "fa-graduation-cap" }
      ]
    },
    {
      category: "Essential 'How-To's",
      items: [
        { id: 4, title: "The Ultimate Resume Checklist", readTime: "4 min", tag: "Resume", icon: "fa-file-alt" },
        { id: 5, title: "Mastering the Technical Interview", readTime: "10 min", tag: "Interview", icon: "fa-user-tie" },
        { id: 6, title: "Building a Portfolio that Hires", readTime: "7 min", tag: "Portfolio", icon: "fa-laptop-code" }
      ]
    },
    {
      category: "Technical Cheatsheets",
      items: [
        { id: 7, title: "Git & GitHub Essentials", readTime: "3 min", tag: "Git", icon: "fa-code-branch" },
        { id: 8, title: "React Hooks Pocket Guide", readTime: "5 min", tag: "React", icon: "fa-atom" },
        { id: 9, title: "Python Tricks for Interviews", readTime: "4 min", tag: "Python", icon: "fa-brands fa-python" }
      ]
    },
    {
      category: "Student Survival",
      items: [
        { id: 10, title: "Open Source for Beginners", readTime: "6 min", tag: "Open Source", icon: "fa-globe" },
        { id: 11, title: "LinkedIn Optimization Guide", readTime: "5 min", tag: "Networking", icon: "fa-brands fa-linkedin" }
      ]
    }
  ];

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <main className="guides-main" onMouseMove={handleMouseMove}>
          
          {/* HERO SECTION */}
          <section className="guides-hero">
            <div className="hero-glow-effect"></div>
            <motion.h1 
              className="guides-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              Knowledge <span className="highlight-text">Base</span>
            </motion.h1>
            <motion.p 
              className="guides-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Documentation for your career. Roadmaps, cheatsheets, and protocols.
            </motion.p>
          </section>

          {/* GUIDES GRID SECTION */}
          <div className="guides-content-wrapper">
            {guidesData.map((section, index) => (
              <motion.div 
                key={index} 
                className="category-section"
                // --- FIXED ANIMATION LOGIC ---
                // We use 'animate' instead of 'whileInView' to guarantee visibility
                // even if the scroll position resets quickly.
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="category-header">
                  <span className="hash">#</span> {section.category}
                </h2>
                
                <div className="guides-grid">
                  {section.items.map((item, i) => (
                    <a 
                      key={item.id} 
                      href={`/guides/${item.id}`} 
                      className="guide-card-item"
                      // Staggered floating animation delay
                      style={{ animationDelay: `${i * 1.2}s` }} 
                    >
                      <div className="guide-card-top">
                        <div className="icon-box">
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <span className="guide-arrow">↗</span>
                      </div>
                      
                      <div className="guide-info">
                        <h3>{item.title}</h3>
                        <div className="guide-meta">
                          <span className="meta-tag">{item.tag}</span>
                          <span className="meta-dot">•</span>
                          <span className="meta-time">{item.readTime}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default Guides;
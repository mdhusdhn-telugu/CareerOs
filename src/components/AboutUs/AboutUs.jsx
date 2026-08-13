import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaArrowRight } from 'react-icons/fa';
import founderImage from '../../assets/images/madhu_sudhan_founder.jpg'; 
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene'; 
import './AboutUs.css';

const AboutUs = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- ADDED: Mouse Tracking Logic ---
  const handleMouseMove = (e) => {
    const boxes = document.getElementsByClassName("bento-box");
    for (const box of boxes) {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      box.style.setProperty("--mouse-x", `${x}px`);
      box.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />

        {/* --- ADDED: onMouseMove Event --- */}
        <main className="about-container" onMouseMove={handleMouseMove}>
          
          <section className="about-hero-clean">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              We are building the <br />
              <span className="text-silver">Operating System</span> for <br />
              Student Success.
            </motion.h1>
          </section>

          {/* THE BENTO GRID */}
          <section className="bento-grid">
            
            {/* ITEM 1: Mission */}
            <motion.div 
              className="bento-box mission-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bento-content">
                <span className="bento-label">The Mission</span>
                <h2>Bridging the Gap</h2>
                <p>
                  The distance between "Academic Theory" and "Industry Reality" is growing. 
                  CodeAstra exists to close that gap. We replace rote memorization with 
                  engineering intuition, helping students transition from 
                  <strong> "coding"</strong> to <strong>"building."</strong>
                </p>
              </div>
            </motion.div>

            {/* ITEM 2: Founder */}
            <motion.div 
              className="bento-box founder-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="founder-image-container">
                <img src={founderImage} alt="Madhu Sudhan" />
                <div className="founder-overlay">
                  <h3>Madhu Sudhan</h3>
                  <span className="founder-role">Founder & Architect</span>
                  <div className="founder-links">
                    <a href="https://linkedin.com/in/madhusudhantelugu/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                    <a href="https://github.com/mdhusdhn-telugu" target="_blank" rel="noreferrer"><FaGithub /></a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ITEM 3: Stat 1 */}
            <motion.div 
              className="bento-box stat-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-big">10K+</div>
              <div className="stat-desc">Lines Compiled</div>
            </motion.div>

            {/* ITEM 4: Stat 2 */}
            <motion.div 
              className="bento-box stat-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-big">100%</div>
              <div className="stat-desc">Student Focused</div>
            </motion.div>

            {/* ITEM 5: Features */}
            <motion.div 
              className="bento-box feature-list-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="bento-label">Core Modules</span>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="f-dot"></span>
                  <span>ATS-Proof Resume Architecture</span>
                </div>
                <div className="feature-item">
                  <span className="f-dot"></span>
                  <span>High-Performance Compilers</span>
                </div>
                <div className="feature-item">
                  <span className="f-dot"></span>
                  <span>System Design & Architecture</span>
                </div>
                <div className="feature-item">
                  <span className="f-dot"></span>
                  <span>Cognitive Aptitude Telemetry</span>
                </div>
              </div>
            </motion.div>

          </section>

          <section className="about-cta">
            <p>Ready to upgrade your career?</p>
            <a href="/signup" className="clean-btn">
              Join the Network <FaArrowRight />
            </a>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
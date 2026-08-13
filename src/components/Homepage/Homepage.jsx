import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer/Footer';
import { motion } from 'framer-motion';
import Scene from './Scene';
import Navbar from '../Navbar/Navbar';
import './Homepage.css';

const Homepage = () => {
  const { user } = useAuth();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mouse tracking for the glow effect
  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("card-item");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  // --- DAILY MISSION LOGIC ---
  const problemPool = [
    { title: "Invert Binary Tree", difficulty: "Medium", color: "medium" },
    { title: "Two Sum", difficulty: "Easy", color: "easy" },
    { title: "Merge k Sorted Lists", difficulty: "Hard", color: "hard" },
    { title: "Valid Palindrome", difficulty: "Easy", color: "easy" },
    { title: "LRU Cache", difficulty: "Medium", color: "medium" },
    { title: "Trapping Rain Water", difficulty: "Hard", color: "hard" },
    { title: "Maximum Subarray", difficulty: "Medium", color: "medium" }
  ];

  // Calculate distinct problem for the day
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const dailyProblem = problemPool[dayOfYear % problemPool.length];

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />

        <main className="main-content">
          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="hero-split-layout">
              
              {/* LEFT SIDE: Text Content */}
              <div className="hero-text-content">
                <motion.h1
                  className="hero-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  The Operating System<br />
                  for <span className="highlight-text">Your Career</span>
                </motion.h1>
                
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  A unified workspace to build resumes, compile code, and master technical interviews. 
                  No distractions. Just performance.
                </motion.p>
                
                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {!user ? (
                    <a href="/signup" className="cta-btn primary">Get Started</a>
                  ) : (
                    <button className="cta-btn primary" onClick={scrollToFeatures}>Open Workspace</button>
                  )}
                </motion.div>
              </div>

              {/* RIGHT SIDE: 3D Terminal */}
              <div className="hero-visual-column">
                <motion.div 
                  className="hero-visual-wrapper"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="hero-glow"></div>
                  <div className="hero-dashboard-border">
                    <div className="hero-dashboard-inner">
                      <div className="terminal-header">
                        <span className="dot dot-grey"></span>
                        <span className="dot dot-grey"></span>
                        <span className="dot dot-grey"></span>
                        <div className="address-bar">~/codeastra/core</div>
                      </div>
                      <div className="terminal-body">
                        <div className="code-line">
                          <span className="syntax-dim">const</span> <span className="syntax-bright">career</span> <span className="syntax-dim">=</span> <span className="syntax-dim">new</span> <span className="syntax-bright">Future()</span>;
                        </div>
                        <div className="code-line">
                          <span className="syntax-bright">career</span>.<span className="syntax-white">optimize</span>(<span className="syntax-string">"MAX_POTENTIAL"</span>);
                        </div>
                        <div className="code-line">
                          <span className="syntax-comment">// Deploying to reality...</span>
                        </div>
                        <div className="code-line typing-cursor">_</div>
                      </div>
                      <div className="scanline"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </section>

          {/* DAILY MISSION SECTION (Replaces Ticker) */}
         

          {/* FEATURES SECTION */}
          <section id="features" className="features-section">
            <div className="section-header">
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>Platform Capabilities</motion.h2>
            </div>
            <motion.div className="grid-container" variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} onMouseMove={handleMouseMove}>
              <FeatureCard icon="fa-file-alt" title="Resume Builder" desc="Create ATS-proof resumes with minimalist, data-driven templates." link="/resume" variant={itemVariants} />
              <FeatureCard icon="fa-code" title="Code Compiler" desc="A robust, latency-free environment for polyglot programming." link="/compiler" variant={itemVariants} />
              <FeatureCard icon="fa-globe-americas" title="Job Discovery" desc="Curated streams of global opportunities in high-growth tech sectors." link="/jobs" variant={itemVariants} />
              <FeatureCard icon="fa-robot" title="Interview Simulator" desc="AI-driven mock interviews with instant performance telemetry." link="/interview" variant={itemVariants} />
              <FeatureCard icon="fa-chart-line" title="Aptitude & Logic" desc="Sharpen cognitive skills with adaptive problem-solving tests." link="/aptitude" variant={itemVariants} />
              <FeatureCard icon="fa-building" title="MNC Prep" desc="Strategic roadmaps for clearing rounds at top-tier corporations." link="/mnc-prep" variant={itemVariants} />
              <FeatureCard icon="fa-layer-group" title="Portfolio" desc="Deploy a professional showcase of your projects in one click." link="/portfolio" variant={itemVariants} />
              <FeatureCard icon="fa-keyboard" title="Typing Speed" desc="Optimize your coding WPM with syntax-focused drills." link="/typing-test" variant={itemVariants} />
            </motion.div>
          </section>

 <section className="mission-section">
            <motion.div 
              className="mission-dock"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="mission-left">
                <div className="pulse-indicator">
                  <span className="ping"></span>
                  <span className="dot"></span>
                </div>
                <span className="mission-label">DAILY TARGET</span>
              </div>

              <div className="mission-center">
                <span className="problem-name">{dailyProblem.title}</span>
                <span className={`difficulty-badge ${dailyProblem.color}`}>
                  {dailyProblem.difficulty}
                </span>
              </div>

              <div className="mission-right">
                <a href="/compiler" className="solve-btn">
                  Initialize <i className="fas fa-code"></i>
                </a>
              </div>
            </motion.div>
          </section>
          {/* ACADEMY SECTION */}
          <section className="academy-section">
            <motion.div 
              className="academy-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              
              {/* LEFT: Text Content */}
              <div className="academy-content">
                <motion.div variants={itemVariants}>
                  <span className="coming-soon-badge">Coming Soon</span>
                </motion.div>
                
                <motion.h2 className="academy-title" variants={itemVariants}>
                  Learn from the <br />
                  <span className="highlight-text">Source Code.</span>
                </motion.h2>
                
                <motion.p className="academy-desc" variants={itemVariants}>
                  Structured, project-based video courses designed to take you from syntax to system architecture. 
                  No fluff, just industry-standard engineering.
                </motion.p>

                <motion.div className="course-tags" variants={itemVariants}>
                  <div className="course-tag"><i className="fab fa-python"></i> Python Masterclass</div>
                  <div className="course-tag"><i className="fas fa-layer-group"></i> Full Stack Web Dev</div>
                  <div className="course-tag"><i className="fas fa-briefcase"></i> SAP Modules</div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {!user ? (
                    <a href="/signup" className="cta-btn primary">
                      Join Waitlist <i className="fas fa-arrow-right" style={{marginLeft: '8px'}}></i>
                    </a>
                  ) : (
                    <button className="cta-btn primary">
                      Notify Me <i className="fas fa-bell" style={{marginLeft: '8px'}}></i>
                    </button>
                  )}
                </motion.div>
              </div>

              {/* RIGHT: Visual Card */}
              <motion.div className="academy-visual" variants={itemVariants}>
                <div className="course-card">
                  <div className="course-image-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
                      alt="CodeAstra Academy Preview" 
                    />
                    <div className="play-overlay">
                      <i className="fas fa-play" style={{marginLeft:'4px'}}></i>
                    </div>
                  </div>
                  <div className="course-details">
                    <div className="course-meta">
                      <span><i className="far fa-clock"></i> 40+ Hours</span>
                      <span><i className="fas fa-signal"></i> Advanced</span>
                    </div>
                    <div className="course-title-preview">CodeAstra Full Stack Architect</div>
                  </div>
                </div>
                <div className="hero-glow" style={{width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)'}}></div>
              </motion.div>

            </motion.div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

// Feature Card Helper Component
const FeatureCard = ({ icon, title, desc, link, variant }) => (
  <motion.a href={link} className="card-item" variants={variant}>
    <div className="card-top"><i className={`fas ${icon} card-icon`}></i><span className="card-arrow">↗</span></div>
    <h3>{title}</h3><p>{desc}</p>
  </motion.a>
);

export default Homepage;
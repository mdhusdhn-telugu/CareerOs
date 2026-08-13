// src/components/MNCPreparation/MNCPreparation.jsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBuilding, 
  FaMoneyBillWave, 
  FaUserGraduate, 
  FaLaptopCode, 
  FaExternalLinkAlt,
  FaLightbulb,
  FaCogs,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

import { mncData } from './data';
import './MNCPreparation.css';

// --- 1. SPOTLIGHT CARD COMPONENT (The "Living" Glow) ---
const SpotlightCard = ({ children, className = "", span = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={`bento-card ${className} ${span}`}
    >
      <div
        className="spotlight-glow"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="card-content-wrapper">{children}</div>
    </div>
  );
};

// --- 2. CUSTOM ACCORDION (Controlled Component) ---
const CustomAccordion = ({ question, answer, idx, isOpen, onToggle }) => {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <span className="q-tag">Q{idx + 1}</span>
        <span className="q-text">{question}</span>
        {isOpen ? <FaChevronUp className="icon-dim" /> : <FaChevronDown className="icon-dim" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="accordion-body"
          >
            <div className="answer-log">
                <div className="terminal-line">// Analysis:</div>
                <div dangerouslySetInnerHTML={{ __html: answer }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MNCPreparation = () => {
  const [activeCompany, setActiveCompany] = useState(mncData[0]);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  // --- FIX: Force Body Background to Black to prevent Blue Flash ---
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).backgroundColor;
    document.body.style.backgroundColor = '#030303';
    return () => {
      document.body.style.backgroundColor = originalStyle;
    };
  }, []);

  // Reset accordion when company changes
  useEffect(() => {
    setOpenAccordionIndex(null);
  }, [activeCompany]);

  const handleAccordionToggle = (index) => {
    setOpenAccordionIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    // WRAPPER: Handles full-width background
    <div className="mnc-page-wrapper">
      
      {/* CONTAINER: Handles centered content */}
      <div className="mnc-container">
        
        <header className="mnc-header">
          <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
          >
              <h1>System Intelligence</h1>
              <p>Declassified hiring protocols for top-tier organizations.</p>
          </motion.div>
        </header>

        {/* --- DOCK NAVIGATION --- */}
        <nav className="company-dock">
          {mncData.map((company) => (
            <button
              key={company.id}
              className={`dock-item ${activeCompany.id === company.id ? 'active' : ''}`}
              onClick={() => setActiveCompany(company)}
            >
              <img src={company.logo} alt={company.name} />
              <span>{company.name}</span>
              {activeCompany.id === company.id && <motion.div layoutId="dock-glow" className="dock-active-bg" />}
            </button>
          ))}
        </nav>

        {/* --- LIVE BENTO GRID --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCompany.id}
            className="bento-grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            {/* 1. HERO CELL */}
            <motion.div variants={item} className="span-2-col">
                <SpotlightCard className="cell-hero">
                  <div className="hero-layout">
                      <div className="logo-box">
                          <img src={activeCompany.logo} alt="Logo" />
                      </div>
                      <div className="hero-details">
                          <h2>{activeCompany.fullName}</h2>
                          <div className="tags-row">
                              {activeCompany.programs.map((p, i) => (
                                  <span key={i} className="tech-tag">{p}</span>
                              ))}
                          </div>
                      </div>
                  </div>
                </SpotlightCard>
            </motion.div>

            {/* 2. OVERVIEW */}
            <motion.div variants={item} className="span-2-col">
                <SpotlightCard className="cell-overview">
                  <div className="card-header"><FaLightbulb /> <span className="header-text">System Overview</span></div>
                  <p className="console-text">
                      <span className="cursor-prefix">{'>'}</span> {activeCompany.overview}
                  </p>
                </SpotlightCard>
            </motion.div>

            {/* 3. STATS ROW */}
            <motion.div variants={item}><SpotlightCard className="cell-stat">
              <div className="stat-label"><FaMoneyBillWave /> Salary</div>
              <div className="stat-val gradient-text">{activeCompany.companyInfo.salaryStructure.split('|')[0]}</div>
            </SpotlightCard></motion.div>

            <motion.div variants={item}><SpotlightCard className="cell-stat">
              <div className="stat-label"><FaUserGraduate /> Eligibility</div>
              <div className="stat-val">{activeCompany.hiringDetails.eligibility.substring(0, 15)}...</div>
            </SpotlightCard></motion.div>

            <motion.div variants={item}><SpotlightCard className="cell-stat">
              <div className="stat-label"><FaLaptopCode /> Mode</div>
              <div className="stat-val">{activeCompany.hiringDetails.examMode.split(' ')[0]}</div>
            </SpotlightCard></motion.div>

            <motion.div variants={item}><SpotlightCard className="cell-stat">
              <div className="stat-label"><FaBuilding /> Type</div>
              <div className="stat-val">{activeCompany.companyInfo.companyType.split(',')[0]}</div>
            </SpotlightCard></motion.div>

            {/* 4. HIRING PIPELINE */}
            <motion.div variants={item} className="span-4-col">
                <SpotlightCard className="cell-process">
                  <div className="card-header"><FaCogs /> <span className="header-text">Execution Pipeline</span></div>
                  <div className="circuit-container">
                      {activeCompany.sections[0].content.map((step, idx) => (
                          <div key={idx} className="circuit-node">
                              <div className="node-marker">
                                  <div className="node-dot"></div>
                                  <div className="node-line"></div>
                              </div>
                              <div className="node-content">
                                  <span className="node-step">0{idx + 1}</span>
                                  <h4>{step.part.split(':')[0]}</h4>
                                  <p>{step.topics.substring(0, 50)}...</p>
                              </div>
                          </div>
                      ))}
                  </div>
                </SpotlightCard>
            </motion.div>

            {/* 5. HR QUESTIONS */}
            <motion.div variants={item} className="span-2-col row-span-2">
                <SpotlightCard className="cell-hr">
                  <div className="card-header">Behavioral Analysis</div>
                  <div className="hr-scroll-area">
                      {activeCompany.hrInterviewQuestions.map((qa, idx) => (
                          <CustomAccordion 
                              key={idx} 
                              idx={idx} 
                              question={qa.question} 
                              answer={qa.answer} 
                              isOpen={openAccordionIndex === idx}
                              onToggle={() => handleAccordionToggle(idx)}
                          />
                      ))}
                  </div>
                </SpotlightCard>
            </motion.div>

            {/* 6. RESOURCES */}
            <motion.div variants={item} className="span-2-col">
                <SpotlightCard className="cell-resources">
                  <div className="card-header">External Uplinks</div>
                  <div className="link-grid">
                      {activeCompany.resources.map((res, idx) => (
                          <a key={idx} href={res.link} target="_blank" rel="noreferrer" className="glass-btn">
                              {res.name} <FaExternalLinkAlt size={10} />
                          </a>
                      ))}
                  </div>
                </SpotlightCard>
            </motion.div>
            
            {/* 7. SYLLABUS */}
            <motion.div variants={item} className="span-2-col">
                <SpotlightCard className="cell-syllabus">
                  <div className="card-header">Technical Manifest</div>
                  <div className="code-block">
                      {activeCompany.sections[1].content.slice(0, 3).map((item, i) => (
                          <div key={i} className="code-line">
                              <span className="code-key">{item.part}:</span> 
                              <span className="code-val">["{item.topics.substring(0, 40)}..."]</span>
                          </div>
                      ))}
                  </div>
                </SpotlightCard>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MNCPreparation;
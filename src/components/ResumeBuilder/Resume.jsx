import React from "react";
import { Link } from "react-router-dom";
import "./Resume.css";

const Resume = () => {
  return (
    <div className="resume-page-container">
      <div className="resume-content">
        <div className="resume-text-content">
          <h1 className="resume-title">
            Architect Your <br />
            Professional Profile.
          </h1>
          <p className="resume-subtitle">
            A high-performance resume builder designed for the modern tech ecosystem. 
            ATS-optimized templates, AI-enhanced content, and instant compilation.
          </p>
          <Link to="/resume/builder" className="resume-cta-button">
            Initialize Builder
          </Link>
        </div>
        
        <div className="resume-visual-content">
          <div className="abstract-resume">
            {/* Visual Skeleton */}
            <div className="ar-header"></div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '30%', height: '80px', background: '#f4f4f5' }}></div>
                <div style={{ width: '70%' }}>
                    <div className="ar-line-long"></div>
                    <div className="ar-line-long"></div>
                    <div className="ar-line-short"></div>
                </div>
            </div>
            <div className="ar-line-long"></div>
            <div className="ar-line-long"></div>
            <div className="ar-line-long"></div>
            <div className="ar-line-short"></div>
            <br />
            <div className="ar-line-long"></div>
            <div className="ar-line-long"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
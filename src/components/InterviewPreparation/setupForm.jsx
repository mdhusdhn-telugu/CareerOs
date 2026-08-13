// src/components/InterviewPreparation/SetupForm.jsx
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORT ICONS (Warning + Close)
import { IoCloudUploadOutline, IoCheckmarkCircle, IoWarningOutline, IoClose } from 'react-icons/io5';
import NeuralBackground from './NeuralBackground';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// --- 2. VALIDATION LOGIC ---
const validateResumeContent = (text) => {
  const keywords = [
    'education', 'experience', 'skills', 'projects', 'summary', 
    'work history', 'contact', 'profile', 'activities', 'certifications',
    'college', 'university', 'bachelor', 'master', 'technologies', 'technical'
  ];
  
  const lowerText = text.toLowerCase();
  // Check if at least 3 standard resume keywords exist
  const matchCount = keywords.reduce((count, word) => lowerText.includes(word) ? count + 1 : count, 0);
  
  // Also check length (Medical bills are usually short or just tables)
  const isLengthValid = text.length > 200; 

  return matchCount >= 3 && isLengthValid;
};

export default function SetupForm({ onStart, apiKey, isLoading }) {
  const [role, setRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  
  // 3. ERROR MODAL STATE
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);
    setShowErrorModal(false); // Reset error state

    try {
      let fullText = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ');
        }
      } else {
        fullText = await file.text();
      }

      // --- 4. CHECK IF VALID ---
      if (validateResumeContent(fullText)) {
        setResumeText(fullText);
      } else {
        setResumeText(''); // Clear text so button stays disabled
        setShowErrorModal(true); // Show the Popup
      }

    } catch (error) {
      console.error(error);
      setFileName('Error reading file');
      setResumeText('');
    } finally {
      setTimeout(() => setIsProcessing(false), 800);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && resumeText) {
      onStart({ role, text: resumeText });
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="ip-glass-panel"
        style={{ maxWidth: '1000px', width: '100%' }} 
      >
        <NeuralBackground />

        <div className="ip-panel-content">
          <div>
            <h1 className="ip-title-large">Neural Link</h1>
            <p className="ip-subtitle">Initialize Interview Simulation Protocol</p>
            
            <p className="ip-description">
              With <strong>CodeAstra</strong>, you can now experience a hyper-realistic 
              <strong> Virtual Technical Interview</strong>. Simply upload your resume 
              to initiate an AI-driven voice session that adapts to your profile, 
              simulating a real recruiter to help you master your communication skills.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="ip-input-group">
              <input
                type="text"
                className="ip-minimal-input"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Enter Target Role (e.g. Senior React Dev)"
                autoFocus
                required
              />
            </div>

            <label className={`ip-drop-zone ${isProcessing ? 'active' : ''}`}>
              <input type="file" accept=".pdf,.txt,.md" hidden onChange={handleFileChange} />
              
              <div className="scan-line"></div>

              <AnimatePresence mode='wait'>
                {isProcessing ? (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', zIndex: 20 }}
                  >
                    <div style={{ color: '#22d3ee', fontFamily: 'monospace', letterSpacing: '1px' }}>
                      SCANNING DOCUMENT...
                    </div>
                  </motion.div>
                ) : resumeText ? (
                  <motion.div 
                    key="loaded"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="file-info"
                  >
                    <IoCheckmarkCircle className="file-icon" style={{ color: '#10b981' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="file-name">{fileName}</div>
                      <div className="file-meta">VERIFIED & READY</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', opacity: 0.7 }}
                  >
                    <IoCloudUploadOutline size={32} style={{ marginBottom: '10px' }}/>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Upload Resume / CV</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>SUPPORTED: PDF, TXT</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>

            <button 
              type="submit" 
              className="ip-hero-btn"
              disabled={!role || !resumeText || isProcessing}
            >
              {isLoading ? 'ESTABLISHING SECURE UPLINK...' : 'INITIALIZE SESSION'}
            </button>
          </form>
        </div>
      </motion.div>

      {/* --- 5. THE POPUP MODAL --- */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="modal-overlay">
            <motion.div 
              className="error-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Close Button X */}
              <button className="modal-top-close" onClick={() => setShowErrorModal(false)}>
                <IoClose />
              </button>

              <div className="modal-icon-wrapper">
                <IoWarningOutline size={40} color="#ef4444" />
              </div>
              <h3>Invalid Document Detected</h3>
              <p>The uploaded file does not appear to be a professional resume. Please ensure the document contains standard sections like "Experience", "Education", or "Skills".</p>
              
            
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
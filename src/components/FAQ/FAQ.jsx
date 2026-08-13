// src/components/FAQ/FAQ.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene'; // Reusing the Starfield
import './FAQ.css';

const faqData = [
  {
    question: "What is CodeAstra?",
    answer: "CodeAstra is an all-in-one platform designed to help students and recent graduates build their careers. We offer a Resume Builder, Job Board, Online Compiler, interview preparation tools, and more."
  },
  {
    question: "Is the Resume Builder free to use?",
    answer: "Yes, the core features of our Resume Builder are completely free. We believe every student should have access to tools that help them create a professional, ATS-friendly resume."
  },
  {
    question: "How are the job postings sourced?",
    answer: "We aggregate job listings from various reputable sources and partner with companies to bring you fresh, relevant job opportunities tailored for students and entry-level professionals."
  },
  {
    question: "Can I save my progress on the platform?",
    answer: "Absolutely. Once you create a free account, you can save multiple versions of your resume, track your job applications, and save your code snippets from the compiler."
  },
  {
    question: "What programming languages does the Online Compiler support?",
    answer: "Our Online Compiler supports a wide range of popular languages, including Python, JavaScript, Java, C++, and C#. We are continuously working to add support for more languages."
  },
  {
    question: "How does the Resume Score Checker work?",
    answer: "The Resume Score Checker uses an algorithm to analyze your resume against common Applicant Tracking System (ATS) criteria and best practices. It checks for key sections, action verbs, formatting, and keyword relevance."
  },
  {
    question: "Are my personal data and documents secure?",
    answer: "Yes, security is our top priority. All user data is encrypted in transit and at rest. We follow strict data protection protocols to ensure your information is safe and private."
  },
  {
    question: "Can I use the platform to prepare for specific company interviews?",
    answer: "While we offer general interview preparation guides and coding challenges, we also have curated content for cracking interviews at major tech companies. You can find company-specific question patterns in our 'Interview Prep' section."
  }
];

const FAQItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = index === openIndex;

  return (
    <motion.div 
      className={`faq-card ${isOpen ? 'active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => setOpenIndex(isOpen ? null : index)}
    >
      <div className="faq-header">
        <h3 className={isOpen ? 'text-gradient' : ''}>{faq.question}</h3>
        <div className={`faq-icon-wrapper ${isOpen ? 'open' : ''}`}>
          {isOpen ? <FaMinus /> : <FaPlus />}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <main className="faq-main">
          <div className="faq-container">
            
            <div className="faq-page-header">
              <span className="badge-pill">Knowledge Base</span>
              <h1>Frequently Asked <span className="text-gradient">Questions</span></h1>
              <p>Everything you need to know about the CodeAstra ecosystem.</p>
            </div>

            <div className="faq-grid">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                />
              ))}
            </div>

          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
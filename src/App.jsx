import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import Global Styles
import './App.css';

// Page Components
import Auth from "./components/Auth/Auth.jsx";
import Layout from "./components/Layout.jsx";
import Homepage from "./components/Homepage/Homepage.jsx";
import Programming from "./components/Programming/Programming.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Resume from "./components/ResumeBuilder/Resume.jsx";
import ResumeBuilder from "./components/ResumeBuilder/ResumeBuilder.jsx";
import Aptitude from "./components/Aptitude/Aptitude.jsx";
import Portfolio from "./components/Portfolio/Portfolio.jsx";        // The Editor (Private)
import PublicPortfolio from './components/Portfolio/PublicPortfolio.jsx'; // The Viewer (Public)
import JobPostings from "./components/JobPostings/JobPostings.jsx";
import InterviewPreparation from "./components/InterviewPreparation/InterviewPreparation.jsx";
import TypingTest from "./components/TypingTest/TypingTest.jsx";
import MNCPreparation from "./components/MNCPreparation/MNCPreparation.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import Blog from './components/Blog/Blog';
import BlogPostPage from './components/Blog/BlogPostPage';
import Guides from './components/Guides/Guides';
import GuidePost from './components/Guides/GuidePost'; // <--- NEW IMPORT
import FAQ from './components/FAQ/FAQ';
import AboutUs from './components/AboutUs/AboutUs';
import Contact from './components/Contact/Contact';
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <Router>
          <Routes>
            {/* --- PUBLIC ROUTES (Accessible by anyone) --- */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            
            {/* Portfolio Viewer (Public) */}
            <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
            
            {/* Content Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} /> 
            
            {/* Guides Routes (New) */}
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuidePost />} /> {/* <--- NEW ROUTE */}

            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Public Demo of Resume Builder */}
            <Route path="/resume-builder" element={<Resume />} />

            {/* --- PROTECTED ROUTES (Requires Login) --- */}
            <Route
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              {/* Dashboard Features */}
              <Route path="profile" element={<Profile />} />
              <Route path="aptitude" element={<Aptitude />} />
              <Route path="aptitude/:topic" element={<Aptitude />} />
              <Route path="compiler" element={<Programming />} />
              
              {/* The Editor: Only the logged-in user can access this */}
              <Route path="portfolio" element={<Portfolio />} />
              
              <Route path="interview" element={<InterviewPreparation />} />
              <Route path="jobs" element={<JobPostings />} />
              <Route path="typing-test" element={<TypingTest />} />
              <Route path="mnc-prep" element={<MNCPreparation />} />
              
              <Route path="resume" element={<Resume />} />
              <Route path="resume/builder" element={<ResumeBuilder />} />
            </Route>

            {/* Fallback: Redirect unknown URLs to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
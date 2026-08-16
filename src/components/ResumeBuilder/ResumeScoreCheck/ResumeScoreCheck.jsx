import React, { useState, useEffect } from 'react';
import './ResumeScoreCheck.css';
import { auth, db } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';


const ResumeScoreCheck = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [scoreResult, setScoreResult] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState('');

  // Handle user authentication and fetch their saved resumes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch resumes from Firestore
const q = query(
  collection(db, "users", currentUser.uid, "resumes"),
  orderBy("updatedAt", "desc")
);
        const querySnapshot = await getDocs(q);
        const userResumes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResumes(userResumes);
        if (userResumes.length > 0) {
          setSelectedResumeId(userResumes[0].id);
        }
      } else {
        setUser(null);
        setResumes([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleScoreResume = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setError("Please select a resume and provide a job description.");
      return;
    }

    setIsScoring(true);
    setError('');
    setScoreResult(null);

    try {
      // 1. Find the selected resume's data
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      if (!selectedResume) throw new Error("Selected resume not found.");

      // 2. Combine resume sections into a single string
      const resumeText = `
        Name: ${selectedResume.name}
        Title: ${selectedResume.title}
        Summary: ${selectedResume.summary}
        Skills: ${selectedResume.skills.join(', ')}
        Experience: ${selectedResume.experience.map(e => `${e.role} at ${e.company}. ${e.description}`).join(' ')}
        Education: ${selectedResume.education.map(e => `${e.degree} from ${e.institution}`).join(' ')}
      `;

      // 3. Call the ResumeRanker API
      const apiKey = import.meta.env.VITE_RESUMERANKER_API_KEY;
      if (!apiKey) throw new Error("ResumeRanker API key is not configured in .env file.");

      // NOTE: This is a placeholder for the actual API endpoint URL from RapidAPI
      const response = await fetch('https://resumeranker.p.rapidapi.com/v1/score-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'resumeranker.p.rapidapi.com'
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          top_k_keywords: 10, // You can adjust how many keywords you want
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      setScoreResult(result);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsScoring(false);
    }
  };
  
  if (isLoading) return <div className="loading-container">Loading...</div>;
  if (!user) return <div className="login-prompt"><h2>Please log in to score your resume.</h2></div>;
  if (resumes.length === 0) return <div className="login-prompt"><h2>You don't have any saved resumes yet. Go to the builder to create one!</h2></div>;

  return (
    <div className="score-check-container">
      <div className="score-check-content">
        <div className="rsc-input-area">
          <h1>Resume Score Checker</h1>
          <p>Select one of your saved resumes and paste a job description below to see how well you match the position. The AI will provide a compatibility score and highlight key matching skills.</p>
          
          <div className="rsc-form-group">
            <label htmlFor="resume-select">Select Your Resume</label>
            <select id="resume-select" value={selectedResumeId} onChange={e => setSelectedResumeId(e.target.value)}>
              {resumes.map(resume => (
                <option key={resume.id} value={resume.id}>{resume.name}'s Resume (Updated: {new Date(resume.updatedAt.seconds * 1000).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          
          <div className="rsc-form-group">
            <label htmlFor="job-description">Paste Job Description</label>
            <textarea id="job-description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the full job description here..."></textarea>
          </div>
          
          <button className="rsc-submit-btn" onClick={handleScoreResume} disabled={isScoring}>
            {isScoring ? 'Scoring...' : 'Check My Score'}
          </button>
        </div>
        
        <div className="rsc-results-area">
          {!scoreResult && !isScoring && !error && (
            <p className="placeholder-text">Your score and matching keywords will appear here.</p>
          )}
          {isScoring && <p>Analyzing... This may take a moment.</p>}
          {error && <div className="rsc-error-message">{error}</div>}
          
          {scoreResult && (
            <>
              <div className="rsc-score-display">
                {Math.round(scoreResult.score * 100)}%
              </div>
              <p className="rsc-score-label">Compatibility Score</p>
              
              <div className="rsc-keywords">
                <h3>Matching Keywords</h3>
                <div className="rsc-keywords-list">
                  {scoreResult.keywords.map((keyword, i) => (
                    <div key={i} className="rsc-keyword-pill">{keyword}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreCheck;
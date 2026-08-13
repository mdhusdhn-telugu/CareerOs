// InterviewPreparation.jsx
import React, { useState } from 'react';
import SetupForm from './SetupForm';
import InterviewSession from './InterviewSession';
import './InterviewPreparation.css';

const InterviewPreparation = () => {
  const [step, setStep] = useState('setup');
  const [resumeData, setResumeData] = useState(null);
  // Silently load API key. No inputs.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const handleStartInterview = (data) => {
    if (!apiKey) {
      alert("System Error: API Key not found in environment variables.");
      return;
    }
    setResumeData(data);
    setStep('interview');
  };

  const handleEndInterview = () => {
    setStep('setup');
    setResumeData(null);
  };

  return (
    <div className="ip-wrapper">
      <div className="ip-bg-glow one" />
      <div className="ip-bg-glow two" />

      {step === 'setup' ? (
        <SetupForm
          onStart={handleStartInterview}
          apiKey={apiKey}
        />
      ) : (
        <InterviewSession
          resumeData={resumeData}
          apiKey={apiKey}
          onEnd={handleEndInterview}
        />
      )}
    </div>
  );
};

export default InterviewPreparation;
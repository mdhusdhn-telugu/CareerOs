// src/components/InterviewPreparation/InterviewSession.jsx
import React, { useEffect, useState, useRef } from 'react';
import useGeminiLive from './useGeminiLive';
import Visualizer3D from './Visualizer3D';
import WebcamPreview from './WebcamPreview'; // <--- NEW IMPORT
import './GeminiOrb.css'; 

export default function InterviewSession({ resumeData, apiKey, onEnd }) {
  const [systemInstruction, setSystemInstruction] = useState('');
  const hasConnectedRef = useRef(false);

  const [orbMode, setOrbMode] = useState('idle');
  const [sessionStarted, setSessionStarted] = useState(false);

  const { 
    connect, disconnect, isConnected, isConnecting, error, 
    inputAnalyserRef, outputAnalyserRef 
  } = useGeminiLive({ apiKey, systemInstruction });

  // 1. UPDATED INSTRUCTIONS: Resume Validation Guardrail
  useEffect(() => {
    if (!resumeData) return;
    const instruction = `
      SYSTEM_IDENTITY:
      - You are "CodeAstra AI", a professional technical interviewer.
      
      CRITICAL - CONTENT VALIDATION STEP:
      - The user has uploaded a document claiming to be a resume.
      - ANALYZE the content provided below under "RESUME_CONTENT".
      - IF the content appears to be a medical bill, receipt, invoice, novel, or random non-career text:
        1. REJECT the session immediately.
        2. Say: "It appears you have uploaded a [document type] instead of a resume. Please upload a valid professional resume to begin the assessment."
        3. Do not ask any technical questions.
      - IF the content is a valid resume, proceed with the interview protocol.

      INTERVIEW PROTOCOL (Only if Resume is Valid):
      1. WAIT for the user to speak first (e.g., "Hi").
      2. Greet them: "Hello, I am CodeAstra AI. I have reviewed your profile for the ${resumeData.role} role. Ready to begin?"
      3. Ask ONE short technical question at a time.
      4. Validate answers briefly. Correct them if wrong.
      5. Move to the next question.

      CONTEXT:
      - Target Role: ${resumeData.role}
      - RESUME_CONTENT: "${resumeData.text.slice(0, 25000)}"
    `.trim();
    setSystemInstruction(instruction);
  }, [resumeData]);

  // ... (Keep Auto Connect & Animation Loop Logic exactly the same) ...
  useEffect(() => {
    if (systemInstruction && !isConnected && !isConnecting && !hasConnectedRef.current && !error) {
      hasConnectedRef.current = true;
      connect();
    }
  }, [systemInstruction, isConnected, isConnecting, error, connect]);

  useEffect(() => {
    if (!isConnected) return;
    let animationFrameId;
    const updateStatus = () => {
        let isAiSpeaking = false;
        let isUserSpeaking = false;
        if (inputAnalyserRef.current) {
            const data = new Uint8Array(inputAnalyserRef.current.frequencyBinCount);
            inputAnalyserRef.current.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            if (avg > 30) { if (avg > 40) isUserSpeaking = true; }
        }
        if (outputAnalyserRef.current) {
            const data = new Uint8Array(outputAnalyserRef.current.frequencyBinCount);
            outputAnalyserRef.current.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            if (avg > 10) { if (avg > 15) isAiSpeaking = true; }
        }
        if ((isUserSpeaking || isAiSpeaking) && !sessionStarted) setSessionStarted(true);
        if (isAiSpeaking && isUserSpeaking) setOrbMode('interrupting'); 
        else if (isAiSpeaking) setOrbMode('speaking');
        else setOrbMode('listening');
        animationFrameId = requestAnimationFrame(updateStatus);
    };
    updateStatus();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isConnected, inputAnalyserRef, outputAnalyserRef, sessionStarted]);

  useEffect(() => {
    return () => {
      disconnect();
      hasConnectedRef.current = false;
    };
  }, [disconnect]);

  return (
    <div className="orb-session-wrapper">
        
        {/* Background */}
        <div className="orb-visualizer-container">
            <Visualizer3D 
                inputAnalyser={inputAnalyserRef.current}
                outputAnalyser={outputAnalyserRef.current}
                isActive={isConnected} 
            />
        </div>

        {/* --- NEW: WEBCAM PREVIEW BOX --- */}
        <WebcamPreview />

        {/* Header Information */}
        <div className="orb-header">
            <h2 className="orb-role-title">{resumeData.role}</h2>
            <div className="orb-status-badge">Live Assessment</div>
        </div>

        <div className="orb-spacer"></div>

        {/* Status Text */}
        <div className="orb-status-text">
             {isConnecting && <span className="status-connecting">ESTABLISHING LINK...</span>}
             {error && <span className="status-error">CONNECTION ERROR</span>}
             
             {isConnected && !error && (
                <>
                  {!sessionStarted ? (
                    <span className="status-listening" style={{ animation: 'none', color: '#fff', fontWeight: '600' }}>
                       SAY "HELLO" TO BEGIN
                    </span>
                  ) : (
                    <>
                      {orbMode === 'speaking' && <span className="status-speaking">CODEASTRA SPEAKING</span>}
                      {orbMode === 'interrupting' && <span className="status-error">INTERRUPTING...</span>}
                      {orbMode === 'listening' && <span className="status-listening">LISTENING...</span>}
                    </>
                  )}
                </>
             )}
        </div>

        <div className="orb-controls">
            <button className="orb-end-btn" onClick={() => { disconnect(); onEnd(); }}>
                End Session
            </button>
        </div>
    </div>
  );
}
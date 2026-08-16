// src/components/Programming/Programming.jsx
import React, { useState, useEffect } from 'react';
import { generateQuestion, judgeCode, runFreeCode } from './api';
import { Dashboard } from './components/Dashboard';
import { QuestionPanel } from './components/QuestionPanel';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ArrowLeft, Play, Clock, Save, Code, Zap } from 'lucide-react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

import 'prismjs/themes/prism-tomorrow.css'; 
import './Programming.css'; 

const Programming = () => {
  const { user } = useAuth();
  
  const [view, setView] = useState('dashboard');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); 
  
  const [outputResult, setOutputResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Helper to append specific comment
  const getStarterComment = (lang) => {
    if (lang === 'python') return '# Write your solution here...\n\n';
    if (lang === 'sql') return '-- Write your query here...\n\n';
    return '// Write your solution here...\n\n';
  };

  const handleOpenPlayground = () => {
    setCurrentQuestion(null);
    setCode('# CodeAstra Playground\n# Write logic, test snippets, and compile instantly.\n\nprint("Hello from CodeAstra!")');
    setLanguage('python');
    setOutputResult(null);
    setView('playground');
  };

  const handleRunPlayground = async () => {
    setIsRunning(true);
    const output = await runFreeCode(code, language);
    setOutputResult({ status: 'Executed', output: output });
    setIsRunning(false);
  };

  const handleGenerate = async (topic, difficulty) => {
    setLoadingId(`${topic}-${difficulty}`);
    try {
      const q = await generateQuestion(topic, difficulty);
      setCurrentQuestion(q);
      
      const rawSkeleton = q.skeletons?.[language] || '';
      const comment = getStarterComment(language);
      setCode(comment + rawSkeleton);
      
      setOutputResult(null);
      setTimer(0);
      setIsTimerRunning(true);
      setView('workspace');
    } catch (e) { 
      // Log AND surface the real error — the old generic "System Busy" alert
      // silently swallowed whatever actually went wrong (missing API key,
      // Gemini rate limit, schema validation failure, etc.), making this
      // impossible to diagnose from the UI alone.
      console.error("Question generation failed:", e);
      alert(`Unable to generate a challenge: ${e.message || "Unknown error"}. Please retry, or check the browser console for details.`);
    } finally { 
      setLoadingId(null); 
    }
  };

  const handleRunJudge = async () => {
    if (!currentQuestion) return;
    setIsRunning(true);
    const res = await judgeCode(currentQuestion, code, language);
    setOutputResult(res);
    if (res.status === 'Passed') setIsTimerRunning(false);
    setIsRunning(false);
  };

  const handleSaveQuestion = async () => {
    if (!user || !currentQuestion) return alert("Account Required: Please login to save progress.");
    try {
      await addDoc(collection(db, "users", user.uid, "savedQuestions"), {
        ...currentQuestion,
        savedAt: serverTimestamp()
      });
      alert("Success: Challenge saved to Profile.");
    } catch (e) { 
      alert("Error: Could not save to database."); 
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;

  useEffect(() => {
    if (view === 'workspace' && currentQuestion) {
        const rawSkeleton = currentQuestion.skeletons?.[language] || '';
        const comment = getStarterComment(language);
        setCode(comment + rawSkeleton);
    }
  }, [language]);

  return (
    <div className="arena-container">
      <div className="arena-header">
        <div className="arena-title">
          <Zap size={20} fill="#fff" /> <span>CodeAstra Arena</span>
        </div>
        <div className="header-actions">
           {view === 'dashboard' && (
             <button onClick={handleOpenPlayground} className="btn-primary">
               <Code size={16}/> Compiler / Playground
             </button>
           )}
           {view !== 'dashboard' && (
             <button onClick={() => setView('dashboard')} className="btn-secondary">
               <ArrowLeft size={16}/> Exit Workspace
             </button>
           )}
        </div>
      </div>

      {view === 'dashboard' && (
        <Dashboard onGenerate={handleGenerate} loadingId={loadingId} />
      )}

      {(view === 'workspace' || view === 'playground') && (
        <div className="workspace-container">
          <div className="left-panel">
            {view === 'workspace' && currentQuestion ? (
              <QuestionPanel question={currentQuestion} language={language} />
            ) : (
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#52525b', textAlign:'center', padding:40}}>
                 <Code size={80} style={{opacity:0.2, marginBottom:20}}/>
                 <h2 style={{color:'#fff'}}>Compiler Mode</h2>
                 <p>Use this space to prototype code, test logic, or learn a new syntax without constraints.</p>
              </div>
            )}
          </div>

          <div className="right-panel">
            <div className="editor-toolbar">
              <div className="toolbar-group">
                 {view === 'workspace' && (
                   <div className="timer"><Clock size={14} /> {formatTime(timer)}</div>
                 )}
                 <select value={language} onChange={(e) => setLanguage(e.target.value)} className="lang-select">
                   <option value="python">Python</option>
                   <option value="javascript">JavaScript</option>
                   <option value="java">Java</option>
                   <option value="cpp">C++</option>
                   <option value="c">C</option>
                   <option value="sql">SQL</option>
                 </select>
              </div>
              
              <div className="toolbar-group">
                {view === 'workspace' && (
                  <button onClick={handleSaveQuestion} className="btn-save-icon" title="Save Question">
                    <Save size={18} />
                  </button>
                )}
                <button 
                  onClick={view === 'workspace' ? handleRunJudge : handleRunPlayground} 
                  disabled={isRunning} 
                  className="run-btn"
                >
                  <Play size={14} fill="#000" /> {isRunning ? 'EXECUTING...' : 'RUN CODE'}
                </button>
              </div>
            </div>

            <div className="editor-area">
               <CodeEditor code={code} onChange={setCode} language={language} />
            </div>

            <div className="output-container">
               <div className="output-header">Terminal / Output</div>
               <OutputPanel result={outputResult} isRunning={isRunning} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programming;
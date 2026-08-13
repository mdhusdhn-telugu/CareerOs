import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getHint, getAnalysis } from '../api';
import { CodeEditor } from './CodeEditor'; 
import { Lightbulb, BookOpen, Unlock, Clock, Database, Copy } from 'lucide-react';

export const QuestionPanel = ({ question, language }) => {
  const [tab, setTab] = useState('desc');
  const [hint, setHint] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHint = async () => {
    setLoading(true);
    setHint(await getHint(question));
    setLoading(false);
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    setAnalysis(await getAnalysis(question, language)); 
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied!");
  };

  return (
    <div className="panel-container">
      <div className="panel-tabs">
        <button onClick={() => setTab('desc')} className={`tab-btn ${tab==='desc' ? 'active' : ''}`}>
            <BookOpen size={14}/> Description
        </button>
        <button onClick={() => setTab('hints')} className={`tab-btn ${tab==='hints' ? 'active' : ''}`}>
            <Lightbulb size={14}/> Hints
        </button>
        <button onClick={() => setTab('sol')} className={`tab-btn ${tab==='sol' ? 'active' : ''}`}>
            <Unlock size={14}/> Solution
        </button>
      </div>

      <div className="panel-content">
        {/* DESC */}
        {tab === 'desc' && (
          <div className="markdown-content">
            <h2>{question.title}</h2>
            <div className="desc-text"><ReactMarkdown>{question.description}</ReactMarkdown></div>
            <h3 className="section-title">Examples</h3>
            {question.examples.map((ex, i) => (
                <div key={i} className="example-box">
                    <div><span className="ex-label">Input:</span> <code className="ex-val">{ex.input}</code></div>
                    <div><span className="ex-label">Output:</span> <code className="ex-val">{ex.output}</code></div>
                </div>
            ))}
          </div>
        )}

        {/* HINT */}
        {tab === 'hints' && (
           <div className="center-content">
             {!hint ? (
               <div className="locked-state">
                   <div className="lock-icon-bg"><Lightbulb size={32} color="#facc15" /></div>
                   <h3>Need a nudge?</h3>
                   <button onClick={fetchHint} disabled={loading} className="reveal-btn hint">
                     {loading ? 'Thinking...' : 'Reveal Hint'}
                   </button>
               </div>
             ) : (
               <div style={{background:'#0f172a', padding:20, borderRadius:8, border:'1px solid #facc15', color:'#fff'}}>
                 <h4 style={{color:'#facc15', marginTop:0}}>Hint</h4>
                 <p>{hint}</p>
               </div>
             )}
           </div>
        )}

        {/* SOLUTION */}
        {tab === 'sol' && (
           <div className="solution-wrapper">
             {!analysis ? (
               <div className="center-content">
                   <div className="locked-state">
                       <div className="lock-icon-bg"><Unlock size={32} color="#ef4444" /></div>
                       <h3>Unlock Solution</h3>
                       <p>View optimal code and analysis.</p>
                       <button onClick={fetchAnalysis} disabled={loading} className="reveal-btn sol">
                         {loading ? 'Analyzing...' : 'Unlock Now'}
                       </button>
                   </div>
               </div>
             ) : (
               <div className="analysis-content">
                 
                 {/* CODE COMES FIRST */}
                 <div className="solution-header">
                    <h3 className="section-title" style={{margin:0}}>Optimal Code ({language})</h3>
                    <button onClick={() => copyToClipboard(analysis.solutionCode)} style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer'}} title="Copy">
                        <Copy size={16}/>
                    </button>
                 </div>
                 
                 <div className="solution-code-block" style={{ height: 'auto', minHeight: '200px' }}>
                    <CodeEditor 
                        code={analysis.solutionCode} 
                        language={language} 
                        readOnly={true} 
                    />
                 </div>

                 <div className="complexity-row">
                    <div className="comp-card">
                        <span className="comp-label"><Clock size={12}/> Time</span>
                        <span className="comp-val time">{analysis.complexity.time}</span>
                    </div>
                    <div className="comp-card">
                        <span className="comp-label"><Database size={12}/> Space</span>
                        <span className="comp-val space">{analysis.complexity.space}</span>
                    </div>
                 </div>

                 <h3 className="section-title">Logic</h3>
                 <div className="markdown-content">
                    <ReactMarkdown>{analysis.approach}</ReactMarkdown>
                 </div>
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};
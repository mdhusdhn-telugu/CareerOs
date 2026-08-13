import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Code2, Hash, Layers, GitBranch, Cpu, Lightbulb, Unlock, BookOpen } from 'lucide-react';

export const Dashboard = ({ onGenerate, loadingId }) => {
  const topics = [
    { id: 'arrays', name: 'Arrays & Hashing', icon: Hash },
    { id: 'two-pointers', name: 'Two Pointers', icon: GitBranch },
    { id: 'dp', name: 'Dynamic Programming', icon: Layers },
    { id: 'strings', name: 'String Manipulation', icon: Code2 },
    { id: 'greedy', name: 'Greedy Algorithms', icon: Cpu },
  ];

  return (
    <div className="dashboard-view">
      <h1 style={{fontSize:'2.5rem', fontWeight:'800', marginBottom:'10px', textAlign:'center'}}>Choose Your Challenge</h1>
      <p style={{textAlign:'center', color:'#94a3b8', marginBottom:'40px'}}>Select a topic to generate an interview question tailored to you.</p>
      
      <div className="topic-grid">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card">
            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px'}}>
               <div style={{background:'rgba(16,185,129,0.1)', padding:'10px', borderRadius:'10px'}}>
                 <topic.icon color="#10b981" />
               </div>
               <h3 style={{fontSize:'1.2rem', fontWeight:'bold'}}>{topic.name}</h3>
            </div>
            {['Easy', 'Medium', 'Hard'].map(diff => {
                const btnId = `${topic.name}-${diff}`;
                const isLoading = loadingId === btnId;
                const isAnyLoading = loadingId !== null;
                return (
                  <button 
                    key={diff} 
                    disabled={isAnyLoading} 
                    onClick={() => onGenerate(topic.name, diff)} 
                    className="difficulty-btn"
                    style={{ opacity: (isAnyLoading && !isLoading) ? 0.5 : 1 }}
                  >
                     {isLoading ? 'Generating...' : diff}
                  </button>
                );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export const QuestionPanel = ({ question, activeTab, setActiveTab, hint, solution, onFetchHint, onFetchSolution, loadingHelp, language }) => {
  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div className="tabs-header">
        <button onClick={() => setActiveTab('description')} className={`tab-btn ${activeTab==='description' ? 'active' : ''}`}>
           <BookOpen size={16} style={{display:'inline', marginRight:5}} /> Problem
        </button>
        <button onClick={() => setActiveTab('hints')} className={`tab-btn ${activeTab==='hints' ? 'active' : ''}`}>
           <Lightbulb size={16} style={{display:'inline', marginRight:5}} /> Hints
        </button>
        <button onClick={() => setActiveTab('solution')} className={`tab-btn ${activeTab==='solution' ? 'active' : ''}`}>
           <Unlock size={16} style={{display:'inline', marginRight:5}} /> Solution
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' && (
           <div className="markdown-body">
             <h2>{question.title}</h2>
             <div style={{background:'#1e293b', padding:'10px', borderRadius:'6px', marginBottom:'20px', borderLeft:'4px solid #10b981'}}>
                 <strong style={{color:'#10b981'}}>Goal:</strong> {question.meaning}
             </div>
             <ReactMarkdown>{question.description}</ReactMarkdown>
             <h3 style={{marginTop:'20px', color:'white'}}>Examples</h3>
             {question.examples.map((ex, i) => (
                 <div key={i} style={{background:'#020617', padding:'10px', borderRadius:'6px', margin:'10px 0', fontFamily:'monospace', fontSize:'0.9rem'}}>
                     <div style={{color:'#64748b'}}>Input: <span style={{color:'#e2e8f0'}}>{ex.input}</span></div>
                     <div style={{color:'#64748b'}}>Output: <span style={{color:'#10b981'}}>{ex.output}</span></div>
                 </div>
             ))}
           </div>
        )}

        {activeTab === 'hints' && (
          <div style={{textAlign:'center', marginTop:40}}>
             {!hint ? (
                <div>
                   <div style={{background:'rgba(234, 179, 8, 0.1)', display:'inline-block', padding:20, borderRadius:'50%', marginBottom:20}}>
                      <Lightbulb size={40} color="#eab308" />
                   </div>
                   <h3>Need a nudge?</h3>
                   <p style={{color:'#94a3b8', marginBottom:20}}>Get a subtle hint to help you move forward without giving away the answer.</p>
                   <button onClick={onFetchHint} disabled={loadingHelp} className="run-btn" style={{margin:'0 auto', background:'#eab308'}}>
                     {loadingHelp ? 'Thinking...' : 'Reveal Hint'}
                   </button>
                </div>
             ) : (
                <div style={{background:'#1e293b', padding:20, borderRadius:10, border:'1px solid #eab308', textAlign:'left'}}>
                   <h4 style={{color:'#eab308', marginTop:0, display:'flex', alignItems:'center', gap:10}}> <Lightbulb size={18}/> Hint</h4>
                   <p style={{lineHeight:1.6}}>{hint}</p>
                </div>
             )}
          </div>
        )}

        {activeTab === 'solution' && (
          <div style={{position:'relative', minHeight:300}}>
             {!solution ? (
                <div className="reveal-overlay" style={{borderRadius:10}}>
                   <div style={{background:'rgba(239, 68, 68, 0.1)', display:'inline-block', padding:20, borderRadius:'50%', marginBottom:20}}>
                      <Unlock size={40} color="#ef4444" />
                   </div>
                   <h3>Stuck completely?</h3>
                   <p style={{color:'#cbd5e1', marginBottom:20, maxWidth:300, textAlign:'center'}}>View the optimal approach, time complexity, and code logic in <span style={{textTransform:'capitalize', color:'white'}}>{language}</span>.</p>
                   <button onClick={onFetchSolution} disabled={loadingHelp} className="run-btn" style={{background:'#ef4444'}}>
                      {loadingHelp ? 'Analyzing...' : 'Unlock Solution'}
                   </button>
                </div>
             ) : (
                <div className="markdown-body">
                   <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20}}>
                      <div style={{background:'#1e293b', padding:10, borderRadius:6}}>
                         <div style={{color:'#64748b', fontSize:'0.8rem', textTransform:'uppercase'}}>Time Complexity</div>
                         <div style={{color:'#10b981', fontWeight:'bold'}}>{solution.complexity.time}</div>
                      </div>
                      <div style={{background:'#1e293b', padding:10, borderRadius:6}}>
                         <div style={{color:'#64748b', fontSize:'0.8rem', textTransform:'uppercase'}}>Space Complexity</div>
                         <div style={{color:'#c084fc', fontWeight:'bold'}}>{solution.complexity.space}</div>
                      </div>
                   </div>
                   
                   <h3 style={{color:'white', marginTop:0}}>Optimal Approach</h3>
                   <div style={{marginBottom: 20, fontStyle:'italic', color:'#94a3b8'}}>
                      <ReactMarkdown>{solution.approach}</ReactMarkdown>
                   </div>
                   
                   <h3 style={{color:'white'}}>Solution Code ({language})</h3>
                   <div style={{background:'#020617', padding:15, borderRadius:8, border:'1px solid #334155', marginBottom:20, overflowX:'auto'}}>
                      <pre style={{margin:0, background:'transparent', border:'none', padding:0}}>
                        <code className={`language-${language}`} style={{fontFamily:'"Fira Code", monospace', fontSize:'0.85rem'}}>
                          {solution.solutionCode}
                        </code>
                      </pre>
                   </div>

                   <h3 style={{color:'white'}}>Step-by-Step Logic</h3>
                   <ReactMarkdown>{solution.reasoning}</ReactMarkdown>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
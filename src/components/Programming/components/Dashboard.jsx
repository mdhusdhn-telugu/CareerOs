// src/components/Programming/Dashboard.jsx
import React, { useState, useRef } from 'react';
import { 
  Code2, GitBranch, Layers, Hash, Cpu, Database, 
  Search, Box, ArrowLeft, Binary, Network, 
  Sigma, Cloud, Terminal, Shield, Globe, Server
} from 'lucide-react';

const topics = [
  // ... (Your existing topics list remains same)
  { id: 'arrays', name: 'Arrays & Hashing', icon: Hash },
  { id: 'two-pointers', name: 'Two Pointers', icon: GitBranch },
  { id: 'sliding', name: 'Sliding Window', icon: ArrowLeft },
  { id: 'stack', name: 'Stack & Queue', icon: Layers },
  { id: 'binary', name: 'Binary Search', icon: Search },
  { id: 'linkedlist', name: 'Linked List', icon: Code2 },
  { id: 'trees', name: 'Trees & Graphs', icon: Network },
  { id: 'trie', name: 'Tries', icon: GitBranch },
  { id: 'heap', name: 'Heap / Priority Queue', icon: Box },
  { id: 'backtracking', name: 'Backtracking', icon: ArrowLeft },
  { id: 'graphs', name: 'Advanced Graphs', icon: Network },
  { id: 'dp1', name: '1D Dynamic Programming', icon: Layers },
  { id: 'dp2', name: '2D Dynamic Programming', icon: Layers },
  { id: 'greedy', name: 'Greedy Algorithms', icon: Cpu },
  { id: 'intervals', name: 'Intervals', icon: Box },
  { id: 'math', name: 'Math & Geometry', icon: Sigma },
  { id: 'bit', name: 'Bit Manipulation', icon: Binary },
  { id: 'sql', name: 'SQL (Relational)', icon: Database },
  { id: 'nosql', name: 'NoSQL (Document)', icon: Database },
  { id: 'concurrency', name: 'Concurrency & Threads', icon: Cpu },
  { id: 'ood', name: 'Object-Oriented Design', icon: Box },
  { id: 'system', name: 'System Design Basics', icon: Server },
  { id: 'api', name: 'REST API Design', icon: Globe },
  { id: 'security', name: 'Security & Auth', icon: Shield },
  { id: 'cloud', name: 'Cloud Architecture', icon: Cloud },
  { id: 'bash', name: 'Shell / Bash Scripting', icon: Terminal },
];

// --- SPOTLIGHT CARD COMPONENT ---
const SpotlightCard = ({ children, className = "", onClick }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => { setOpacity(1); };
  const handleBlur = () => { setOpacity(0); };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onClick={onClick}
      className={`topic-card-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }} // Ensure glow stays inside
    >
      <div
        className="spotlight-glow"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export const Dashboard = ({ onGenerate, loadingId }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Practice Arena</h1>
        <p className="dashboard-sub">
          CodeAstra provides an adaptive environment to master algorithms and system design.
          Select a domain to initialize a simulation.
        </p>
      </div>
      
      <div className="topic-grid">
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopic === topic.id;

          return (
            <SpotlightCard 
              key={topic.id} 
              onClick={() => setSelectedTopic(topic.id)} 
              className={`topic-card ${isSelected ? 'active' : ''}`}
            >
              <div className="topic-header">
                <div className="topic-icon"><Icon size={20} /></div>
                <h3>{topic.name}</h3>
              </div>
              
              {isSelected && (
                <div className="difficulty-buttons">
                  {['Easy', 'Medium', 'Hard'].map((diff) => {
                    const btnId = `${topic.name}-${diff}`;
                    const isLoading = loadingId === btnId;
                    const isAnyLoading = loadingId !== null;

                    return (
                      <button 
                        key={diff} 
                        disabled={isAnyLoading} 
                        onClick={(e) => { e.stopPropagation(); onGenerate(topic.name, diff); }} 
                        className={`diff-btn ${diff.toLowerCase()}`}
                        style={{ 
                           opacity: (isAnyLoading && !isLoading) ? 0.5 : 1,
                           cursor: isAnyLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isLoading ? '...' : diff}
                      </button>
                    );
                  })}
                </div>
              )}
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
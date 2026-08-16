import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../../hooks/useQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// UI Components
import { Box, Typography, Pagination, Button, Modal, CircularProgress } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FunctionsIcon from '@mui/icons-material/Functions';
import GestureIcon from '@mui/icons-material/Gesture';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
   import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Custom Components
// NOTE: Navbar and Footer are intentionally NOT imported/rendered here.
// Aptitude is a protected route rendered inside Layout.jsx (see App.jsx),
// which already renders its own navbar header and <Footer /> around every
// protected page via <Outlet />. Rendering them again here caused a visibly
// doubled navbar/footer on this page.
import Scene from '../Homepage/Scene';
import QuestionItem from './QuestionItem';
import './Aptitude.css';
import Footer from '../Footer/Footer';

const QUESTIONS_PER_PAGE = 10;
const TEST_DURATION = 15 * 60;

const topics = [
  { id: 'arithmetic', label: 'Arithmetic', icon: <CalculateIcon fontSize="small" /> },
  { id: 'datainterpretation', label: 'Data Interpretation', icon: <BarChartIcon fontSize="small" /> },
  { id: 'verbalability', label: 'Verbal Ability', icon: <SpellcheckIcon fontSize="small" /> },
  { id: 'logicalreasoning', label: 'Logical Reasoning', icon: <PsychologyIcon fontSize="small" /> },
  { id: 'verbalreasoning', label: 'Verbal Reasoning', icon: <FunctionsIcon fontSize="small" /> },
  { id: 'nonverbalreasoning', label: 'Nonverbal Reasoning', icon: <GestureIcon fontSize="small" /> },
];

const Aptitude = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const currentTag = topic || 'arithmetic';
  const { questions, loading, error } = useQuestions({ limit: 150, tags: currentTag });
  
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  const intervalRef = useRef(null);
  const questionsRef = useRef(null);
  const wrapperRef = useRef(null);

  // --- MOUSE GLOW LOGIC ---
  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const cards = document.getElementsByClassName("glow-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  // Logic Helpers
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    if (questions.length > 0) {
      const newShuffled = questions.map(q => {
        const optionsToShuffle = q.options.map((t, i) => ({ text: t, originalIndex: i }));
        const shuffledOptions = shuffleArray(optionsToShuffle);
        return {
          ...q,
          options: shuffledOptions.map(o => o.text),
          answerIndex: shuffledOptions.findIndex(o => o.originalIndex === q.answerIndex),
        };
      });
      setShuffledQuestions(newShuffled);
    }
  }, [questions]);

  useEffect(() => { resetTest(); }, [currentTag]);

  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      clearInterval(intervalRef.current);
      handleSubmit();
    }
    return () => clearInterval(intervalRef.current);
  }, [isTimerActive, timeRemaining]);

  const resetTest = () => {
    clearInterval(intervalRef.current);
    setCurrentPage(1);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowModal(false);
    setTimeRemaining(TEST_DURATION);
    setIsTimerActive(false);
    setFinalScore(0);
  };

  const handleAnswerSelect = (gIndex, sIndex) => {
    if (isSubmitted) return; 
    setUserAnswers(prev => ({ ...prev, [gIndex]: sIndex }));
    if (!isTimerActive) setIsTimerActive(true);
  };

  const handleSubmit = async () => {
    setIsTimerActive(false);
    clearInterval(intervalRef.current);
    let score = 0;
    Object.entries(userAnswers).forEach(([qIdx, ansIdx]) => {
      if (shuffledQuestions[qIdx].answerIndex === ansIdx) score++;
    });
    setFinalScore(score);
    setIsSubmitted(true);
    setShowModal(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTopicChange = (newTopic) => {
    navigate(`/aptitude/${newTopic}`);
    // Delay scroll slightly to ensure render
    setTimeout(() => {
        if(questionsRef.current) questionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToQuestion = (index) => {
    const page = Math.floor(index / QUESTIONS_PER_PAGE) + 1;
    setCurrentPage(page);
    // Logic to scroll to the top of the stream
    if(questionsRef.current) questionsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const totalPages = Math.ceil(shuffledQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = shuffledQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = shuffledQuestions.length > 0 ? (answeredCount / shuffledQuestions.length) * 100 : 0;


  return (
    <>
      <Scene />
      {/* Page Wrapper forces Flex column to push Footer down */}
      <div className="aptitude-page-wrapper" ref={wrapperRef} onMouseMove={handleMouseMove}>

        {/* HERO SECTION */}
        <section className="aptitude-hero">
          <div className="aptitude-hero-content">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="aptitude-hero-text">
              <h1 className="aptitude-title">Sharpen Your <br /><span className="highlight-text">Cognitive Edge</span></h1>
              <p className="aptitude-subtitle">Adaptive problem-solving tests designed to prepare you for high-stakes corporate assessments.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="aptitude-hero-visual">
                <div className="stat-glass-box glow-card">
                    <div className="stat-number-big">IQ</div>
                    <div className="stat-label-small">Assessment Ready</div>
                </div>
            </motion.div>
          </div>
        </section>

        {/* STICKY NAV - Using Position Sticky properly */}
        <div className="sticky-nav-anchor">
            <div className="sticky-nav-content">
                <div className="topics-pill-bar">
                    {topics.map((t) => (
                        <button key={t.id} onClick={() => handleTopicChange(t.id)} className={`topic-pill ${currentTag === t.id ? 'active' : ''}`}>
                            {t.icon}<span>{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN WORKSPACE - FlexGrow ensures it pushes footer */}
        <div className="test-workspace-container">
            <div className="test-workspace-grid" ref={questionsRef}>
                
                {/* LEFT: Question Stream */}
                <div className="questions-stream">
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#6A67FF' }} /></Box>
                    ) : error ? (
                        <Typography color="error">Failed to load questions.</Typography>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                {currentQuestions.map((q, index) => {
                                    const globalIndex = startIndex + index;
                                    const isAnswered = userAnswers[globalIndex] !== undefined;
                                    
                                    return (
                                        <QuestionItem 
                                            key={q.id} 
                                            question={q} 
                                            questionNumber={globalIndex + 1} 
                                            userAnswer={userAnswers[globalIndex]} 
                                            isRevealed={isSubmitted || isAnswered} 
                                            onSelectOption={(optIdx) => handleAnswerSelect(globalIndex, optIdx)} 
                                        />
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {!loading && !error && (
                        <div className="stream-footer">
                             <Pagination count={totalPages} page={currentPage} onChange={(e, v) => setCurrentPage(v)} size="large" sx={{ '& .MuiPaginationItem-root': { color: '#a1a1aa' }, '& .Mui-selected': { backgroundColor: '#6A67FF !important', color: '#fff' } }} />
                        </div>
                    )}
                </div>

                {/* RIGHT: Sticky Command Center */}
                <aside className="command-center-col">
                    <div className="command-panel glow-card">
                        <div className="panel-header">
                            <div className="timer-wrapper" style={{ color: timeRemaining < 60 ? '#ef4444' : '#fff' }}>
                                <AccessTimeIcon />
                                <span className="timer-digits">{formatTime(timeRemaining)}</span>
                            </div>
                            <div className="panel-status">
                                {isTimerActive ? <span className="badge-live">Live</span> : <span className="badge-idle">Idle</span>}
                            </div>
                        </div>

                        <div className="panel-progress">
                            <div className="progress-labels">
                                <span>Progress</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        <div className="question-grid-label">Question Palette</div>
                        <div className="question-grid">
                            {shuffledQuestions.map((_, idx) => {
                                const isAnswered = userAnswers[idx] !== undefined;
                                const isCurrent = idx >= startIndex && idx < startIndex + QUESTIONS_PER_PAGE;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`grid-dot ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                                        onClick={() => scrollToQuestion(idx)}
                                    >
                                        {idx + 1}
                                    </div>
                                );
                            })}
                        </div>

                        {!isSubmitted && (
                            <button className="submit-exam-btn" onClick={handleSubmit}>
                                <CheckCircleOutlineIcon fontSize="small" />
                                Submit Test
                            </button>
                        )}
                    </div>
                </aside>
            </div>
        </div>

        <Modal open={showModal} onClose={() => setShowModal(false)}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: '#0a0a0a', border: '1px solid #333', borderRadius: '16px', p: 4, color: 'white', textAlign: 'center', boxShadow: '0 0 50px rgba(106, 103, 255, 0.2)' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Test Complete</Typography>
                <div className="score-display">
                    {Math.round((finalScore / shuffledQuestions.length) * 100)}%
                </div>
                <Typography sx={{ color: '#a1a1aa', mb: 3 }}>Score: {finalScore} / {shuffledQuestions.length}</Typography>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <Button variant="outlined" onClick={() => setShowModal(false)} sx={{ color: '#fff', borderColor: '#333' }}>Review</Button>
                    <Button variant="contained" onClick={resetTest} sx={{ bgcolor: '#6A67FF' }}>Retry</Button>
                </div>
            </Box>
        </Modal>

        <Footer />
      </div>
    </>
  );
};

export default Aptitude;
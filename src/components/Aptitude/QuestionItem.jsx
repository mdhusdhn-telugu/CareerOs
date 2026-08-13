import React from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { motion } from 'framer-motion';

const QuestionItem = React.memo(({ question, questionNumber, userAnswer, isRevealed, onSelectOption }) => {
  const { question: questionText, options, answerIndex, explanation } = question;

  const getOptionClass = (index) => {
    if (isRevealed) {
        if (index === answerIndex) return 'option-card correct';
        if (index === userAnswer && index !== answerIndex) return 'option-card wrong';
        return 'option-card dim';
    }
    if (index === userAnswer) return 'option-card selected';
    return 'option-card';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box className="question-container glow-card">
        
        {/* Question Header */}
        <div className="question-header">
            <span className="q-num">{questionNumber < 10 ? `0${questionNumber}` : questionNumber}</span>
            <h3 className="q-text">{questionText}</h3>
        </div>

        {/* Options Grid */}
        <div className="options-grid">
          {options.map((option, index) => (
            <div
              key={index}
              className={getOptionClass(index)}
              onClick={() => !isRevealed && onSelectOption(index)}
            >
                <div className="opt-indicator">
                    {/* Icons for immediate feedback */}
                    {isRevealed && index === answerIndex && <CheckCircleOutlineIcon className="status-icon" />}
                    {isRevealed && index === userAnswer && index !== answerIndex && <HighlightOffIcon className="status-icon" />}
                    {!isRevealed && <span className="opt-letter">{String.fromCharCode(65 + index)}</span>}
                </div>
                <span className="opt-text">{option}</span>
            </div>
          ))}
        </div>

        {/* Explanation Box */}
        <Collapse in={isRevealed} timeout={300}>
          <div className="explanation-box">
            <div className="exp-label">EXPLANATION</div>
            <p className="exp-text">{explanation}</p>
          </div>
        </Collapse>
      </Box>
    </motion.div>
  );
});

export default QuestionItem;
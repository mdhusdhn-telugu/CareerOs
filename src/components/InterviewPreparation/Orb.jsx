// src/components/InterviewPreparation/Orb.jsx
import React from 'react';
import './GeminiOrb.css';

const Orb = ({ isActive, intensity, mode }) => {
  // Scale base size by intensity
  const baseScale = isActive ? 1 + (intensity * 0.5) : 1;
  
  let containerClass = 'orb-core';
  let glowClass = '';

  switch (mode) {
    case 'connecting':
      containerClass += ' orb-connecting';
      glowClass = 'orb-glow-connecting';
      break;
    case 'listening':
      containerClass += ' orb-listening';
      glowClass = 'orb-glow-listening';
      break;
    case 'speaking':
      containerClass += ' orb-speaking';
      glowClass = 'orb-glow-speaking';
      break;
    case 'interrupting':
      containerClass += ' orb-interrupting'; // New mode
      glowClass = 'orb-glow-interrupting';
      break;
    default:
      containerClass += ' orb-idle';
      glowClass = 'orb-glow-idle';
  }

  return (
    <div className="orb-container">
      {isActive && (
        <>
          <div 
            className="orb-ring orb-ring-1"
            style={{ transform: `scale(${1 + intensity})` }}
          />
          <div 
            className="orb-ring orb-ring-2"
            style={{ transform: `scale(${1 + intensity * 0.8})` }}
          />
        </>
      )}

      <div 
        className={`${containerClass} ${glowClass}`}
        style={{
          transform: `scale(${baseScale})`,
          // Dynamic shadow intensity
          boxShadow: `0 0 ${40 + intensity * 60}px var(--shadow-color)`
        }}
      >
        <div className="orb-shine orb-shine-1" />
        <div className="orb-shine orb-shine-2" />
      </div>

      {mode === 'connecting' && (
        <div className="orb-spinner" />
      )}
    </div>
  );
};

export default Orb;
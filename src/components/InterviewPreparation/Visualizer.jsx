// src/components/InterviewPreparation/Visualizer.jsx
import React, { useRef, useEffect } from 'react';

const Visualizer = ({ inputAnalyser, outputAnalyser, isActive }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationId;
    const inputBufferLength = inputAnalyser ? inputAnalyser.frequencyBinCount : 0;
    const outputBufferLength = outputAnalyser ? outputAnalyser.frequencyBinCount : 0;
    
    const inputDataArray = new Uint8Array(inputBufferLength);
    const outputDataArray = new Uint8Array(outputBufferLength);

    const drawRing = (dataArray, bufferLength, color, baseRadius, sensitivity, phaseShift) => {
      if (bufferLength === 0) return;
      ctx.beginPath();
      const rotationOffset = phaseShift || 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const angle = (i / bufferLength) * Math.PI * 2 + rotationOffset;
        const r = baseRadius + (percent * sensitivity);
        const x = (canvas.width / 2) + Math.cos(angle) * r;
        const y = (canvas.height / 2) + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const baseR = Math.min(width, height) / 4; 

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      if (inputAnalyser) inputAnalyser.getByteFrequencyData(inputDataArray);
      if (outputAnalyser) outputAnalyser.getByteFrequencyData(outputDataArray);

      // --- USER (Inner - Cyan/White) ---
      // Replaced Green with Cyan/White for Tech Look
      drawRing(inputDataArray, inputBufferLength, 'rgba(255, 255, 255, 0.9)', baseR, 40, 0);
      drawRing(inputDataArray, inputBufferLength, 'rgba(34, 211, 238, 0.5)', baseR + 10, 30, 0.5);

      // --- AI (Outer - Deep Cyan/Blue) ---
      // Replaced Purple with Deep Cyan
      const aiBaseR = baseR + 50; 
      drawRing(outputDataArray, outputBufferLength, 'rgba(34, 211, 238, 0.8)', aiBaseR, 50, Math.PI);
      drawRing(outputDataArray, outputBufferLength, 'rgba(6, 182, 212, 0.3)', aiBaseR + 20, 60, Math.PI + 1.0);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, inputAnalyser, outputAnalyser]);

  return <canvas ref={canvasRef} className="visualizer-canvas" />;
};

export default Visualizer;
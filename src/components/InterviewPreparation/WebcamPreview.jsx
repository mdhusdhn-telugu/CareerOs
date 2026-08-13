// src/components/InterviewPreparation/WebcamPreview.jsx
import React, { useState, useRef, useEffect } from 'react';
import { IoVideocamOutline, IoVideocamOffOutline } from 'react-icons/io5';

const WebcamPreview = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn Off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      // Turn On
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }, 
          audio: false 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(e => console.error("Play error:", e));
        }
        
        setIsCameraOn(true);
      } catch (err) {
        console.error("Camera Error:", err);
        alert("Unable to access camera. Please check permissions.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="webcam-wrapper">
      <div className={`webcam-frame ${isCameraOn ? 'active' : ''}`}>
        
        {/* Video Element */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="webcam-video" 
          style={{ display: isCameraOn ? 'block' : 'none' }}
        />
        
        {/* Placeholder (Avatar) */}
        {!isCameraOn && (
          <div className="webcam-placeholder">
            <div className="avatar-circle">YOU</div>
          </div>
        )}

        {/* --- NEW: Integrated Toggle Bar --- */}
        <div className="webcam-controls">
            <button 
                className={`cam-btn ${isCameraOn ? 'on' : 'off'}`} 
                onClick={toggleCamera}
            >
                {isCameraOn ? <IoVideocamOutline /> : <IoVideocamOffOutline />}
                <span>{isCameraOn ? "ON" : "OFF"}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default WebcamPreview;
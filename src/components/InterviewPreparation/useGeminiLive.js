// src/components/InterviewPreparation/useGeminiLive.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decodeAudio, decodeAudioData, createPcmBlob } from './audioUtils';

export default function useGeminiLive({ apiKey, systemInstruction, voiceName = 'Kore' }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Audio Contexts
  const audioContextRef = useRef(null);
  const inputContextRef = useRef(null);
  const inputAnalyserRef = useRef(null);
  const outputAnalyserRef = useRef(null);
  
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set());
  const sessionPromiseRef = useRef(null);
  const streamRef = useRef(null);
  const scriptProcessorRef = useRef(null);

  const cleanup = useCallback(() => {
    if (sourcesRef.current) {
      sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
      });
      sourcesRef.current.clear();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close().catch(() => {});
      inputContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(async () => {
    if (!apiKey) {
      setError('API Key is missing.');
      return;
    }
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      inputContextRef.current = inputCtx;
      audioContextRef.current = audioCtx;

      const inputAnalyser = inputCtx.createAnalyser();
      inputAnalyser.fftSize = 256;
      inputAnalyserRef.current = inputAnalyser;

      const outputAnalyser = audioCtx.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyserRef.current = outputAnalyser;

      const outputNode = audioCtx.createGain();
      outputNode.connect(outputAnalyser);
      outputAnalyser.connect(audioCtx.destination);

      // 1. IMPROVED MICROPHONE CONSTRAINTS
      // Request hardware processing if available
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        } 
      });
      streamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);

      // 2. HIGHPASS FILTER (Remove rumble/wind noise below 100Hz)
      const highPassFilter = inputCtx.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.value = 100;

      // 3. Chain: Source -> Filter -> Analyser -> Processor -> Dest
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      source.connect(highPassFilter);
      highPassFilter.connect(inputAnalyser);
      inputAnalyser.connect(processor);
      processor.connect(inputCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
          },
          systemInstruction: { parts: [{ text: systemInstruction }] },
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            setIsConnected(true);
            setIsConnecting(false);
            nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
            
            processor.onaudioprocess = e => {
              if (!inputContextRef.current) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              
              // 4. NOISE GATE IMPLEMENTATION
              // Calculate Root Mean Square (RMS) volume
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);

              // Threshold: 0.02 is roughly -34dB. Adjust if too sensitive.
              // If volume is below this, we send SILENCE.
              if (rms < 0.02) {
                 // Fill buffer with zeros (silence)
                 for (let i = 0; i < inputData.length; i++) {
                   inputData[i] = 0;
                 }
              }

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                try {
                   session.sendRealtimeInput({ media: pcmBlob });
                } catch(e) {
                   console.error("Send Error", e);
                }
              });
            };
          },
          onmessage: async message => {
            const base64Audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              const buffer = await decodeAudioData(
                decodeAudio(base64Audio),
                ctx,
                24000,
                1
              );
              
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                ctx.currentTime
              );
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNode);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
              };
            }
            
            if (message.serverContent?.interrupted) {
              console.log("AI Interrupted");
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
            }
          },
          onclose: () => {
            console.log("Session Closed");
            cleanup();
          },
          onerror: err => {
            console.error("Session Error", err);
            setError('Connection error.');
            cleanup();
          },
        },
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setError('Microphone or API Error');
      setIsConnecting(false);
      cleanup();
    }
  }, [apiKey, systemInstruction, voiceName, cleanup, isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
         try { session.close(); } catch(e) {}
      });
    }
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    error,
    inputAnalyserRef,
    outputAnalyserRef,
  };
}
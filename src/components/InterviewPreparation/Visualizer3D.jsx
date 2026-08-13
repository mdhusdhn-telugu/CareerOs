import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

// --- AUDIO REACTIVE COMPONENT ---
function ReactiveParticles({ inputAnalyser, outputAnalyser, isActive }) {
  const userRef = useRef();
  const aiRef = useRef();
  
  // 1. Generate Particle Geometries
  // User: Dense inner sphere (Cyan)
  const userSphere = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 1.2 }), []);
  
  // AI: Larger outer shell (White/Silver)
  const aiSphere = useMemo(() => random.onSphere(new Float32Array(4000), { radius: 2.5 }), []);

  // Buffers for audio data
  const dataArray = useMemo(() => new Uint8Array(128), []);

  useFrame((state, delta) => {
    if (!isActive) {
      // Idle Animation
      if (userRef.current) {
        userRef.current.rotation.y += delta * 0.1;
        userRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      if (aiRef.current) {
        aiRef.current.rotation.y -= delta * 0.05;
        aiRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      return;
    }

    // --- USER AUDIO REACTION (Input) ---
    let userVol = 0;
    if (inputAnalyser) {
      inputAnalyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      userVol = avg / 50; // Normalize (0 to ~5)
    }

    if (userRef.current) {
      // Pulse size based on volume
      const targetScale = 1 + userVol * 0.8; 
      userRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
      // Spin faster when talking
      userRef.current.rotation.y += delta * (0.2 + userVol * 0.5);
      userRef.current.rotation.z += delta * (userVol * 0.2);
    }

    // --- AI AUDIO REACTION (Output) ---
    let aiVol = 0;
    if (outputAnalyser) {
      outputAnalyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      aiVol = avg / 50; 
    }

    if (aiRef.current) {
      const targetScale = 1 + aiVol * 0.5;
      aiRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      // Outer shell rotates counter-direction
      aiRef.current.rotation.y -= delta * (0.1 + aiVol * 0.3);
      
      // Jitter effect for AI voice
      if (aiVol > 0.5) {
         aiRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      } else {
         aiRef.current.rotation.x = THREE.MathUtils.lerp(aiRef.current.rotation.x, 0, 0.1);
      }
    }
  });

  return (
    <group>
      {/* USER CORE (Cyan) */}
      <Points ref={userRef} positions={userSphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* AI SHELL (White) */}
      <Points ref={aiRef} positions={aiSphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

const Visualizer3D = ({ inputAnalyser, outputAnalyser, isActive }) => {
  return (
    <div className="visualizer-3d-wrapper">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        {/* Ambient Light for depth */}
        <ambientLight intensity={0.5} />
        
        {/* The Reactive Particles */}
        <ReactiveParticles 
            inputAnalyser={inputAnalyser} 
            outputAnalyser={outputAnalyser} 
            isActive={isActive} 
        />
      </Canvas>
    </div>
  );
};

export default Visualizer3D;
// src/components/InterviewPreparation/NeuralBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function ParticleField(props) {
  const ref = useRef();
  
  // Generate 1500 random points in a sphere
  const sphere = useMemo(() => random.inSphere(new Float32Array(1500), { radius: 1.2 }), []);

  useFrame((state, delta) => {
    // Rotate the cloud slowly
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    // Breathing effect (scale pulse)
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#22d3ee"  /* Cyan to match your theme */
          size={0.003}     /* Very fine, elegant particles */
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

const NeuralBackground = () => {
  return (
    <div className="neural-canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default NeuralBackground;
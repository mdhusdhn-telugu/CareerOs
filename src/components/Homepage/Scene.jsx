import * as THREE from 'three';
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function StarField({ count = 800 }) {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 120; // Wide spread
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 50;
      const speed = Math.random() * 0.05;
      temp.push({ x, y, z, speed });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      // Gentle floating motion
      particle.y += particle.speed * 0.2;
      
      // Reset position to create infinite loop
      if (particle.y > 60) particle.y = -60;

      dummy.position.set(particle.x, particle.y, particle.z);
      
      // Slight scale variation for "twinkle" effect
      const s = Math.abs(Math.sin(state.clock.elapsedTime * particle.speed + i)); 
      const scale = 0.05 + s * 0.05; 
      
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.5, 4, 4]} />
      {/* PURE WHITE/GREY COLOR - Professional & Clean */}
      <meshBasicMaterial color="#a1a1aa" transparent opacity={0.4} />
    </instancedMesh>
  );
}

const Scene = () => {
  return (
    <div id="bg-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: '#030303' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Stars = memo(() => {
  const ref = useRef<THREE.Points>(null);
  
  // Increased particle count with lazy loading benefits
  const particleCount = 1200; // Increased from 800
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const depth = Math.random();
      positions[i3] = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.5) * 120;
      positions[i3 + 2] = (Math.random() - 0.5) * 80 - 40;
      
      // Simpler color - mostly white
      const color = new THREE.Color();
      const hue = 0.6 + Math.random() * 0.1;
      const saturation = Math.random() * 0.2;
      const lightness = 0.85 + Math.random() * 0.15;
      color.setHSL(hue, saturation, lightness);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = depth * 0.25 + 0.08;
    }
    
    return [positions, colors, sizes];
  }, []);

  // Very slow rotation
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 50; // Much slower
      ref.current.rotation.y -= delta / 75;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.2}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
        <bufferAttribute
          attach="geometry-attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="geometry-attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </Points>
    </group>
  );
});

Stars.displayName = 'Stars';

// Orbiting planets - simplified version
const Planets = memo(() => {
  const planet1Ref = useRef<THREE.Mesh>(null);
  const planet2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (planet1Ref.current) {
      planet1Ref.current.position.x = Math.cos(time * 0.2) * 40;
      planet1Ref.current.position.z = Math.sin(time * 0.2) * 40 - 60;
      planet1Ref.current.rotation.y = time * 0.5;
    }
    
    if (planet2Ref.current) {
      planet2Ref.current.position.x = Math.cos(time * 0.15 + Math.PI) * 60;
      planet2Ref.current.position.y = Math.sin(time * 0.15 + Math.PI) * 10;
      planet2Ref.current.position.z = Math.sin(time * 0.15) * 60 - 80;
      planet2Ref.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group>
      {/* Purple planet */}
      <mesh ref={planet1Ref}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.2} />
      </mesh>
      
      {/* Blue planet */}
      <mesh ref={planet2Ref}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
      </mesh>
    </group>
  );
});

Planets.displayName = 'Planets';

const StarfieldBackground: React.FC = memo(() => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10" style={{ contain: 'layout style paint' }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Stars />
        <Planets />
      </Canvas>
    </div>
  );
});

StarfieldBackground.displayName = 'StarfieldBackground';
export default StarfieldBackground;

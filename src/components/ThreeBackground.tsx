import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TentacleJointProps {
  index: number;
  maxJoints: number;
  jointRefs: React.MutableRefObject<THREE.Group[]>;
  wireframeColor: string;
  theme: 'dark' | 'light';
}

const TentacleJoint: React.FC<TentacleJointProps> = ({ index, maxJoints, jointRefs, wireframeColor, theme }) => {
  const scale = Math.pow(0.86, index);
  const radius = 0.12 * scale;
  const length = 0.28 * Math.pow(0.94, index);

  return (
    <group
      ref={(el) => {
        if (el) jointRefs.current[index] = el;
      }}
      position={[length, 0, 0]}
    >
      <mesh>
        <sphereGeometry args={[radius, 12, 12]} />
        <meshBasicMaterial
          color={wireframeColor}
          wireframe={true}
          transparent={true}
          opacity={(theme === 'light' ? 0.4 : 0.65) - index * 0.03}
        />
      </mesh>

      {/* Recursive children joints */}
      {index < maxJoints - 1 && (
        <TentacleJoint index={index + 1} maxJoints={maxJoints} jointRefs={jointRefs} wireframeColor={wireframeColor} theme={theme} />
      )}
    </group>
  );
};

interface OctopusTentacleProps {
  angle: number;
  scrollVelocityRef: React.RefObject<number>;
  wireframeColor: string;
  theme: 'dark' | 'light';
}

const OctopusTentacle: React.FC<OctopusTentacleProps> = ({ angle, scrollVelocityRef, wireframeColor, theme }) => {
  const jointRefs = useRef<THREE.Group[]>([]);
  // Use a phase accumulator ref to prevent phase jumping when speed shifts
  const phaseRef = useRef(0);

  useFrame((_, delta) => {
    // Read the smooth, noise-free scroll velocity calculated by the parent Scene
    const currentVelocity = scrollVelocityRef.current ?? 0;
    
    // Clamp the velocity to prevent extreme/jittery distortions under fast scroll
    const cappedScrollDir = Math.max(Math.min(currentVelocity, 0.35), -0.35);

    // Absolute scroll velocity for wave speed/amplitude modulation
    const absScrollVel = Math.abs(cappedScrollDir);
    const speed = 1.2 + absScrollVel * 1.0;
    const waveOffset = 0.3;

    // Wave amplitude reacts slightly to scroll speed (much gentler wave)
    const intensity = 0.05 + absScrollVel * 0.03;

    // Accumulate phase frame-by-frame continuously (fixes phase-jump jitter)
    phaseRef.current += delta * speed;

    jointRefs.current.forEach((joint, idx) => {
      if (!joint) return;

      // 1. Natural gentle rest pose (much straighter)
      const restBend = 0.01 - (idx * 0.008);

      // 2. Slow fluid wave propagation using accumulated phase
      const wave = Math.sin(phaseRef.current - idx * waveOffset) * intensity;

      // 3. Directional flare/pull: 
      // Scroll Down (cappedScrollDir > 0) -> bends inward to point them straight down (streamlined)
      // Scroll Up (cappedScrollDir < 0) -> bends outward to spread the tentacles (flare)
      // Multiplied by index factor so the tips bend slightly more dynamically, but capped to a gentle bend
      const flareBend = -cappedScrollDir * 0.5 * (1 + idx * 0.02);

      // Combine factors for smooth, direction-aware water physics
      joint.rotation.z = restBend + wave + flareBend;
      joint.rotation.y = Math.cos(phaseRef.current * 0.6 - idx * 0.2) * 0.03;
    });
  });

  return (
    <group rotation={[0, angle, -Math.PI / 4]}>
      <TentacleJoint index={0} maxJoints={12} jointRefs={jointRefs} wireframeColor={wireframeColor} theme={theme} />
    </group>
  );
};

const OctopusScene: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const octopusRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);
  
  // Smooth scroll interpolation engine values
  const lerpedScrollY = useRef(0);
  const lastLerpedScrollY = useRef(0);
  const scrollVelocity = useRef(0); // Shared smooth velocity ref

  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Background Starfield (theme-reactive colors)
  const [positions, colors] = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;

      if (theme === 'light') {
        // Darker slate/purple particles in light mode
        const r = 0.25 + Math.random() * 0.25;
        const g = 0.25 + Math.random() * 0.2;
        const b = 0.55 + Math.random() * 0.25;
        cols[i * 3] = r;
        cols[i * 3 + 1] = g;
        cols[i * 3 + 2] = b;
      } else {
        // Bright blue/purple/white particles in dark mode
        const r = 0.5 + Math.random() * 0.5;
        const g = 0.6 + Math.random() * 0.4;
        const b = 0.9 + Math.random() * 0.1;
        cols[i * 3] = r;
        cols[i * 3 + 1] = g;
        cols[i * 3 + 2] = b;
      }
    }
    return [pos, cols];
  }, [theme]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Interpolate scroll position smoothly
    lastLerpedScrollY.current = lerpedScrollY.current;
    lerpedScrollY.current = THREE.MathUtils.lerp(lerpedScrollY.current, scrollY.current, 0.05);

    // 2. Calculate smooth, noise-free delta frame-by-frame
    const lerpedDelta = lerpedScrollY.current - lastLerpedScrollY.current;
    
    // 3. Map delta to smooth velocity with subtle decay
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, lerpedDelta * 0.08, 0.1);

    if (octopusRef.current) {
      // Use the smoothly interpolated scroll position to position the octopus
      const hover = Math.sin(time * 0.8) * 0.15;
      octopusRef.current.position.y = hover - (lerpedScrollY.current * 0.0018);
      
      // Slow rotation
      octopusRef.current.rotation.y = time * 0.06;

      // Mouse interactive tilt
      octopusRef.current.rotation.x = Math.sin(time * 0.12) * 0.05 + (mouse.current.y * 0.15);
      octopusRef.current.rotation.z = THREE.MathUtils.lerp(
        octopusRef.current.rotation.z,
        mouse.current.x * 0.2,
        0.05
      );
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.01;
      particlesRef.current.position.x = THREE.MathUtils.lerp(
        particlesRef.current.position.x,
        mouse.current.x * 0.3,
        0.05
      );
      particlesRef.current.position.y = THREE.MathUtils.lerp(
        particlesRef.current.position.y,
        mouse.current.y * 0.3,
        0.05
      );
    }

    // 4. Position camera using the exact same lerpedScrollY to ensure perfect relative sync
    const targetCamY = -(lerpedScrollY.current * 0.0035);
    camera.position.y = targetCamY;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.2, 0.06);
  });

  const tentacles = Array.from({ length: 8 }).map((_, i) => (i * Math.PI * 2) / 8);
  const wireframeColor = theme === 'light' ? '#121214' : '#ffffff';

  // Light adjustments for contrast
  const ambientIntensity = theme === 'light' ? 0.65 : 0.25;
  const dirLight1Intensity = theme === 'light' ? 0.4 : 0.8;
  const dirLight2Intensity = theme === 'light' ? 0.3 : 0.5;
  const dirLight1Color = theme === 'light' ? '#7c3aed' : '#a855f7';
  const dirLight2Color = theme === 'light' ? '#00b4d8' : '#00f3ff';

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[-5, 3, 2]} intensity={dirLight1Intensity} color={dirLight1Color} />
      <directionalLight position={[5, -3, 2]} intensity={dirLight2Intensity} color={dirLight2Color} />

      {/* Theme-aware Wireframe Swimming Octopus */}
      <group ref={octopusRef} position={[0.6, 0.1, -4.2]}>
        
        {/* Mantle (Head) */}
        <mesh position={[0, 0.5, 0]} scale={[0.85, 1.3, 0.9]}>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshBasicMaterial
            color={wireframeColor}
            wireframe={true}
            transparent={true}
            opacity={theme === 'light' ? 0.4 : 0.7}
          />
        </mesh>

        {/* Left Eye Bump */}
        <mesh position={[-0.35, 0.05, 0.38]} scale={[0.16, 0.16, 0.16]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={wireframeColor} wireframe={true} opacity={theme === 'light' ? 0.5 : 0.85} />
        </mesh>

        {/* Right Eye Bump */}
        <mesh position={[0.35, 0.05, 0.38]} scale={[0.16, 0.16, 0.16]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={wireframeColor} wireframe={true} opacity={theme === 'light' ? 0.5 : 0.85} />
        </mesh>

        {/* Tentacles sharing the smooth velocity ref */}
        {tentacles.map((angle, idx) => (
          <OctopusTentacle key={idx} angle={angle} scrollVelocityRef={scrollVelocity} wireframeColor={wireframeColor} theme={theme} />
        ))}
      </group>

      {/* Ambient background particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors={true}
          transparent={true}
          opacity={0.3}
          sizeAttenuation={true}
        />
      </points>
    </>
  );
};

export const ThreeBackground: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <div style={{ ...containerStyle, background: 'var(--bg-dark)' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <OctopusScene theme={theme} />
      </Canvas>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: -1,
  pointerEvents: 'none',
};

export default ThreeBackground;

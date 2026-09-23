import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherSceneProps {
  weatherCategory: string;
  isDay: boolean;
  temperature: number;
}

function AtmosphericSphere({ weatherCategory, isDay, temperature }: WeatherSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => {
    if (!isDay) return '#1a1a4e';
    switch (weatherCategory) {
      case 'clear': return temperature > 35 ? '#ff6b35' : '#4fc3f7';
      case 'cloudy': return '#78909c';
      case 'rain': return '#37474f';
      case 'storm': return '#263238';
      case 'fog': return '#90a4ae';
      case 'snow': return '#b3e5fc';
      case 'drizzle': return '#546e7a';
      default: return '#4fc3f7';
    }
  }, [weatherCategory, isDay, temperature]);

  const emissiveColor = useMemo(() => {
    if (!isDay) return '#0d1b3e';
    switch (weatherCategory) {
      case 'clear': return '#ffab40';
      case 'rain': return '#1565c0';
      case 'storm': return '#1a237e';
      default: return '#0288d1';
    }
  }, [weatherCategory, isDay]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.1}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function RainParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 10 - 5,
      z: (Math.random() - 0.5) * 10,
      speed: 0.05 + Math.random() * 0.1,
    }));
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y -= p.speed;
      if (p.y < -5) p.y = 5;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.02, 0.15, 0.02);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshBasicMaterial color="#64b5f6" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function SnowParticles({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 10 - 5,
      z: (Math.random() - 0.5) * 10,
      speed: 0.01 + Math.random() * 0.03,
      wobble: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y -= p.speed;
      p.wobble += 0.01;
      if (p.y < -5) p.y = 5;
      dummy.position.set(p.x + Math.sin(p.wobble) * 0.3, p.y, p.z);
      dummy.scale.set(0.05, 0.05, 0.05);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#e3f2fd" transparent opacity={0.8} />
    </instancedMesh>
  );
}

function CloudParticles({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 3 + 2,
      z: (Math.random() - 0.5) * 4 - 2,
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.002 + Math.random() * 0.005,
    }));
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.x += p.speed;
      if (p.x > 5) p.x = -5;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.scale, p.scale * 0.5, p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#cfd8dc" transparent opacity={0.15} />
    </instancedMesh>
  );
}

function Scene({ weatherCategory, isDay, temperature }: WeatherSceneProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 80 : 200;

  return (
    <>
      <ambientLight intensity={isDay ? 0.4 : 0.15} />
      <pointLight position={[5, 5, 5]} intensity={isDay ? 1 : 0.3} color={isDay ? '#fff5e1' : '#4a6fa5'} />
      <pointLight position={[-3, -2, 4]} intensity={0.3} color="#7c4dff" />

      <AtmosphericSphere weatherCategory={weatherCategory} isDay={isDay} temperature={temperature} />

      {(weatherCategory === 'rain' || weatherCategory === 'drizzle' || weatherCategory === 'storm') && (
        <RainParticles count={weatherCategory === 'storm' ? particleCount : Math.floor(particleCount * 0.6)} />
      )}
      {weatherCategory === 'snow' && <SnowParticles count={Math.floor(particleCount * 0.5)} />}
      {(weatherCategory === 'cloudy' || weatherCategory === 'fog') && <CloudParticles count={isMobile ? 15 : 30} />}

      {!isDay && <Stars radius={50} depth={30} count={isMobile ? 500 : 1500} factor={3} fade speed={1} />}
    </>
  );
}

export default function WeatherScene3D({ weatherCategory, isDay, temperature }: WeatherSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene weatherCategory={weatherCategory} isDay={isDay} temperature={temperature} />
        </Suspense>
      </Canvas>
    </div>
  );
}

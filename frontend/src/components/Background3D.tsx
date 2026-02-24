'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useTheme } from './ThemeProvider';

function FloatingElements({ theme }: { theme: 'male' | 'female' | 'default' }) {
    // Generate colors based on theme
    const color1 = theme === 'female' ? '#ec4899' : theme === 'male' ? '#0ea5e9' : '#10b981';
    const color2 = theme === 'female' ? '#f43f5e' : theme === 'male' ? '#6366f1' : '#06b6d4';
    const color3 = theme === 'female' ? '#d946ef' : theme === 'male' ? '#8b5cf6' : '#8b5cf6';

    const groupRef = useRef<any>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />

            {/* Distorted large background sphere */}
            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[-5, 2, -10]} scale={4}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial color={color1} distort={0.4} speed={1.5} roughness={0.2} metalness={0.8} opacity={0.1} transparent />
                </mesh>
            </Float>

            {/* Floating Glass Cubes */}
            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                <Box args={[1.5, 1.5, 1.5]} position={[8, 5, -12]} rotation={[0.5, 0.5, 0]}>
                    <meshPhysicalMaterial color={color2} roughness={0.1} metalness={0.1} transmission={0.9} ior={1.5} thickness={1} opacity={0.3} transparent />
                </Box>
            </Float>

            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={3}>
                <Box args={[1.2, 1.2, 1.2]} position={[-9, -4, -8]} rotation={[1, 0.2, 0.5]}>
                    <meshPhysicalMaterial color={color3} roughness={0.1} metalness={0.1} transmission={0.9} ior={1.5} thickness={1} opacity={0.4} transparent />
                </Box>
            </Float>

            {/* Floating Torus */}
            <Float speed={1} rotationIntensity={3} floatIntensity={2}>
                <Torus args={[2, 0.4, 16, 32]} position={[6, -6, -15]} rotation={[-0.5, 0.8, 0]}>
                    <meshStandardMaterial color={color1} emissive={color1} emissiveIntensity={0.5} roughness={0.4} opacity={0.2} transparent />
                </Torus>
            </Float>

            <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[0.8, 32, 32]} position={[0, 8, -8]}>
                    <meshStandardMaterial color={color2} emissive={color2} emissiveIntensity={1} opacity={0.3} transparent />
                </Sphere>
            </Float>
        </group>
    );
}

export default function Background3D() {
    const { theme } = useTheme();

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
                <FloatingElements theme={theme} />
            </Canvas>
        </div>
    );
}

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles } from 'lucide-react';

// Enhanced 3D composition with "Glassmorphism" floating elements
function AestheticModel({ gender }: { gender: string }) {
    const meshRef = useRef<any>(null);
    const color = gender === 'female' ? '#ec4899' : '#8b5cf6'; // Pink for girl, Purple for boy
    const accent = gender === 'female' ? '#fb7185' : '#a78bfa';

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Main Center Avatar (Abstractized beautifully) */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[0, 0.5, 0]}>
                    <capsuleGeometry args={[0.4, 1.2, 32, 32]} />
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.1}
                        metalness={0.8}
                        clearcoat={1}
                        transmission={0.5}
                        thickness={1}
                    />
                </mesh>
                <mesh position={[0, 1.7, 0]}>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.2}
                        metalness={0.6}
                        clearcoat={1}
                    />
                </mesh>

                {/* Glowing Core / Eyes */}
                <mesh position={[0, 1.7, 0.3]}>
                    <boxGeometry args={[0.4, 0.1, 0.1]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            </Float>

            {/* Floating Glass Panels (UI Representation) */}
            <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[-1.5, 1, 0.5]} rotation={[0, 0.5, 0]}>
                    <boxGeometry args={[1.2, 0.8, 0.05]} />
                    <meshPhysicalMaterial
                        color="white"
                        transmission={0.9}
                        opacity={1}
                        metalness={0}
                        roughness={0}
                        ior={1.5}
                        thickness={0.5}
                        transparent
                    />
                </mesh>
                <mesh position={[1.5, 1.5, 0.2]} rotation={[0, -0.3, 0]}>
                    <boxGeometry args={[0.8, 1.2, 0.05]} />
                    <meshPhysicalMaterial
                        color="white"
                        transmission={0.9}
                        opacity={1}
                        metalness={0}
                        roughness={0}
                        ior={1.5}
                        thickness={0.5}
                        transparent
                    />
                </mesh>
            </Float>

            {/* Glowing Orbs around */}
            <Float speed={3} rotationIntensity={2} floatIntensity={3}>
                <Sphere args={[0.2, 32, 32]} position={[1.2, 0, 1]}>
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} toneMapped={false} />
                </Sphere>
            </Float>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[0.15, 32, 32]} position={[-1.2, 2, -1]}>
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
                </Sphere>
            </Float>
            <Float speed={1.5} rotationIntensity={3} floatIntensity={1}>
                <Sphere args={[0.1, 32, 32]} position={[0, -0.2, 1.5]}>
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} toneMapped={false} />
                </Sphere>
            </Float>

            {/* Distorted Background Element */}
            <mesh position={[0, 1, -2]} scale={3}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial color={color} distort={0.4} speed={2} roughness={0.2} metalness={0.8} opacity={0.3} transparent />
            </mesh>
        </group>
    );
}

export default function AIAssistant({ gender }: { gender: 'male' | 'female' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([
        { role: 'ai', content: `Hello! I'm your ${gender === 'female' ? 'girl' : 'boy'} AI assistant. How can I help you study today?` }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const currentInput = input;
        setInput('');

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: `I can certainly help you with "${currentInput}". Let's break it down into easy chunks!` }]);
        }, 1000);
    };

    const themeColor = gender === 'female' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(139, 92, 246, 0.4)';
    const glowColor = gender === 'female' ? '#ec4899' : '#8b5cf6';

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${glowColor}` }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: 30, right: 30, zIndex: 50,
                    width: 65, height: 65, borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${themeColor}`,
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    cursor: 'pointer'
                }}
            >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: `2px dashed ${themeColor}`, opacity: 0.5 }} />
                <Sparkles size={28} color={gender === 'female' ? '#f472b6' : '#a78bfa'} />
            </motion.button>

            {/* AI Assistant Modal - Glassmorphic */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: 110, right: 30, zIndex: 50,
                            width: 380, height: 650, borderRadius: 24,
                            background: 'rgba(15, 15, 25, 0.4)',
                            backdropFilter: 'blur(30px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(30px) saturate(150%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${themeColor}`,
                            display: 'flex', flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 12, height: 12, borderRadius: '50%',
                                    background: glowColor, boxShadow: `0 0 15px ${glowColor}`
                                }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>3D Study AI</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* 3D Canvas Area */}
                        <div style={{ height: 280, position: 'relative' }}>
                            {/* Decorative background glow inside the canvas container */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, background: glowColor, filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }} />

                            <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
                                <ambientLight intensity={0.8} />
                                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
                                <Environment preset="city" />
                                <AestheticModel gender={gender} />
                                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 2 - 0.5} />
                                <ContactShadows position={[0, -0.6, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color={glowColor} />
                            </Canvas>
                        </div>

                        {/* Chat History */}
                        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10 }}>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%', padding: '12px 16px',
                                        borderRadius: 20,
                                        borderBottomRightRadius: m.role === 'user' ? 4 : 20,
                                        borderBottomLeftRadius: m.role === 'ai' ? 4 : 20,
                                        background: m.role === 'user'
                                            ? `linear-gradient(135deg, ${gender === 'female' ? '#f472b6, #db2777' : '#a78bfa, #7c3aed'})`
                                            : 'rgba(255,255,255,0.08)',
                                        border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        boxShadow: m.role === 'user' ? `0 4px 15px ${themeColor}` : 'none',
                                        color: 'white',
                                        fontSize: '0.95rem', lineHeight: 1.5,
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    {m.content}
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', zIndex: 10 }}>
                            <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '6px 6px 6px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message Study AI..."
                                    style={{
                                        flex: 1, background: 'transparent', border: 'none', color: 'white',
                                        outline: 'none', fontSize: '0.95rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: glowColor,
                                        boxShadow: `0 0 15px ${glowColor}`,
                                        color: 'white', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Send size={18} style={{ marginLeft: -2 }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

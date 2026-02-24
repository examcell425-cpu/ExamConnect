'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X } from 'lucide-react';

// Generic Component to load GLTF models (since we don't have actual boys/girls GLB models locally yet, we will use a primitive or external URL if available, but for demonstration we'll render a dynamic representation)
function Model({ gender }: { gender: string }) {
    const meshRef = useRef<any>(null);

    // Simple idle animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
            meshRef.current.rotation.y += 0.01;
        }
    });

    const color = gender === 'female' ? '#ec4899' : '#8b5cf6'; // Pink for girl, Purple for boy

    return (
        <group ref={meshRef}>
            {/* Simple representation of a robot/avatar until a real GLB is provided */}
            <mesh castShadow position={[0, 0.5, 0]}>
                <capsuleGeometry args={[0.5, 1, 4, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.15, 1.6, 0.35]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[0.15, 1.6, 0.35]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="white" />
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

        // Simulate AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: `I can certainly help you with "${currentInput}". Let's break it down!` }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: 30, right: 30, zIndex: 50,
                    width: 60, height: 60, borderRadius: '50%',
                    background: gender === 'female' ? 'var(--gradient-female)' : 'var(--gradient-main)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    border: 'none', cursor: 'pointer'
                }}
            >
                <MessageSquare size={28} />
            </motion.button>

            {/* AI Assistant Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: 100, right: 30, zIndex: 50,
                            width: 380, height: 600, borderRadius: 24,
                            background: 'rgba(20, 20, 30, 0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--border-glass)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            display: 'flex', flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px', borderBottom: '1px solid var(--border-glass)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: '#4ade80', boxShadow: '0 0 10px #4ade80'
                                }} />
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Study AI</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* 3D Canvas Area */}
                        <div style={{ height: 250, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)' }}>
                            <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                                <Environment preset="city" />
                                <Model gender={gender} />
                                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                                <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                            </Canvas>
                        </div>

                        {/* Chat History */}
                        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%', padding: '10px 14px',
                                        borderRadius: 16,
                                        borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                                        borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
                                        background: m.role === 'user'
                                            ? (gender === 'female' ? 'var(--gradient-female)' : 'var(--gradient-main)')
                                            : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '0.9rem', lineHeight: 1.4
                                    }}
                                >
                                    {m.content}
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 16, borderTop: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 6 }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask your AI..."
                                    style={{
                                        flex: 1, background: 'transparent', border: 'none', color: 'white',
                                        padding: '8px 14px', outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: gender === 'female' ? '#ec4899' : '#8b5cf6',
                                        color: 'white', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <Send size={16} style={{ marginLeft: -2 }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

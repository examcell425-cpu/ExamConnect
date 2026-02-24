'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroupChat() {
    const { profile } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch initial messages and subscribe
    useEffect(() => {
        if (!isOpen) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('group_messages')
                .select('*, profiles(full_name, role)')
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) {
                setMessages(data.reverse());
                scrollToBottom();
            }
        };

        fetchMessages();

        // Subscribe to realtime inserts
        const subscription = supabase
            .channel('public:group_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, async (payload) => {
                const newMessage = payload.new;
                // Fetch profile info for the new message
                const { data: profileData } = await supabase.from('profiles').select('full_name, role').eq('id', newMessage.sender_id).single();
                newMessage.profiles = profileData;

                setMessages(prev => [...prev, newMessage]);
                scrollToBottom();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [isOpen]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async () => {
        if (!input.trim() || !profile) return;

        const currentInput = input;
        setInput('');

        await supabase.from('group_messages').insert([{
            sender_id: profile.id,
            content: currentInput
        }]);
    };

    // Only show to authenticated users
    if (!profile) return null;

    return (
        <>
            {/* Global Chat Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: 30, left: 30, zIndex: 40,
                    padding: '12px 20px', borderRadius: 30,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    backdropFilter: 'blur(10px)',
                    color: 'white', display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    cursor: 'pointer', fontWeight: 600
                }}
            >
                <Users size={20} color="var(--accent-blue)" />
                Group Chat
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        style={{
                            position: 'fixed', bottom: 90, left: 30, zIndex: 40,
                            width: 350, height: 500, borderRadius: 20,
                            background: 'rgba(20, 20, 30, 0.9)',
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
                            background: 'rgba(59, 130, 246, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Users size={20} color="#60a5fa" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Global Student Chat</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {messages.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>No messages yet. Say hi!</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === profile.id;
                                    return (
                                        <div key={msg.id} style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '85%',
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: isMe ? 'flex-end' : 'flex-start'
                                        }}>
                                            {!isMe && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, marginLeft: 4 }}>
                                                    {msg.profiles?.full_name} {msg.profiles?.role === 'teacher' && '(Teacher)'}
                                                </span>
                                            )}
                                            <div style={{
                                                padding: '10px 14px',
                                                borderRadius: 16,
                                                borderBottomRightRadius: isMe ? 4 : 16,
                                                borderBottomLeftRadius: !isMe ? 4 : 16,
                                                background: isMe ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                                                color: 'white',
                                                fontSize: '0.9rem', lineHeight: 1.4,
                                                border: isMe ? 'none' : '1px solid var(--border-glass)'
                                            }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 16, borderTop: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)',
                                        color: 'white', padding: '10px 14px', borderRadius: 20, outline: 'none', fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'var(--accent-blue)', color: 'white',
                                        border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
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

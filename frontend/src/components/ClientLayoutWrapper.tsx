'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AIAssistant from './AIAssistant';
import GroupChat from './GroupChat';
import LiveClasses from './LiveClasses';
import Background3D from './Background3D';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();

    return (
        <>
            <Background3D />
            {children}
            {/* Render AI Assitant globally for authenticated students */}
            {profile && profile.role === 'student' && (
                <AIAssistant gender={(profile.gender as 'male' | 'female') || 'female'} />
            )}

            {/* Global Group Chat */}
            <GroupChat />

            {/* Global Live Classes */}
            <LiveClasses />
        </>
    );
}

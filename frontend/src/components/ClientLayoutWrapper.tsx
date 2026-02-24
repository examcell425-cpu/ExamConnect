'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import GroupChat from './GroupChat';
import LiveClasses from './LiveClasses';
import dynamic from 'next/dynamic';

// Fix for Next.js SSR hydration crashing with 3D Canvas / FBX loaders
const Background3D = dynamic(() => import('./Background3D'), {
    ssr: false,
    loading: () => <div style={{ position: 'fixed', inset: 0, background: '#0f0f13', zIndex: -10 }} />
});

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();

    return (
        <>
            <Background3D />
            {children}

            {/* Global Group Chat */}
            <GroupChat />

            {/* Global Live Classes */}
            <LiveClasses />
        </>
    );
}

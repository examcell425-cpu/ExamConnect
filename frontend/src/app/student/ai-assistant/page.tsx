'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const AIAssistant = dynamic(() => import('@/components/AIAssistant'), {
    ssr: false,
    loading: () => <div className="animate-pulse w-full h-[600px] bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">Loading 3D Engine...</div>
});

export default function AIAssistantPage() {
    const { profile } = useAuth();

    if (!profile) return null;

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Sparkles className="text-purple-400" size={28} />
                        Interactive AI Assistant
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Your personal 3D study companion powered by Google Gemini.
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <AIAssistant gender={(profile.gender as 'male' | 'female') || 'female'} />
            </div>
        </div>
    );
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ThemeContextType {
    theme: 'male' | 'female' | 'default';
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'default' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const [theme, setTheme] = useState<'male' | 'female' | 'default'>('default');

    useEffect(() => {
        // Only apply gender themes to students
        if (profile?.role === 'student' && profile.gender) {
            setTheme(profile.gender as 'male' | 'female');
        } else {
            setTheme('default');
        }
    }, [profile]);

    // Apply the theme to the body or a wrapper div so CSS variables can cascade
    useEffect(() => {
        if (theme === 'male') {
            document.documentElement.setAttribute('data-theme', 'male');
        } else if (theme === 'female') {
            document.documentElement.setAttribute('data-theme', 'female');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

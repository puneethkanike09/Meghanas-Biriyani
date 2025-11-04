'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
};

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme;
            return savedTheme || 'system';
        }
        return 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            const systemTheme = darkQuery.matches ? 'dark' : 'light';
            const activeTheme = theme === 'system' ? systemTheme : theme;

            root.classList.remove('light', 'dark');
            root.classList.add(activeTheme);
            localStorage.setItem('theme', theme);
        };

        updateTheme();
        darkQuery.addEventListener('change', updateTheme);

        return () => {
            darkQuery.removeEventListener('change', updateTheme);
        };
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
'use client';

import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const renderIcon = () => {
        switch (theme) {
            case 'dark':
                return <MoonIcon className="w-6 h-6" />;
            case 'light':
                return <SunIcon className="w-6 h-6" />;
            case 'system':
            default:
                return <ComputerDesktopIcon className="w-6 h-6" />;
        }
    };

    return (
        <button
            onClick={() => {
                if (theme === 'dark') setTheme('light');
                else if (theme === 'light') setTheme('system');
                else setTheme('dark');
            }}
            className="rounded-lg p-2 text-black dark:text-white"
        >
            {renderIcon()}
        </button>
    );
}
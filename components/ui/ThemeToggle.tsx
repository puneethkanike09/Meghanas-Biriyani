"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

type Theme = "dark" | "light" | "system";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    const renderIcon = () => {
        const iconClass = "h-6 w-6";
        
        switch (theme) {
            case "dark":
                return <MoonIcon className={iconClass} />;
            case "light":
                return <SunIcon className={iconClass} />;
            case "system":
            default:
                return <ComputerDesktopIcon className={iconClass} />;
        }
    };

    return (
        <button
            onClick={() => {
                setTheme((current) => ({
                    dark: "light",
                    light: "system",
                    system: "dark"
                }[current] as Theme));
            }}
            className="rounded-lg p-2 hover:bg-gray-100 text-black dark:text-primary dark:hover:bg-gray-800 transition-colors"
            aria-label={`Switch to ${
                theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
            } mode`}
        >
            {renderIcon()}
        </button>
    );
}




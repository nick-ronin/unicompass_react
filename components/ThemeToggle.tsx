'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
    lang?: string;
}

const themeCopy = {
    ru: {
        dark: 'Темная тема',
        light: 'Светлая тема',
        system: 'Системная тема',
    },
    en: {
        dark: 'Dark theme',
        light: 'Light theme',
        system: 'System theme',
    },
};

export default function ThemeToggle({ lang = 'ru' }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const copy = themeCopy[(lang as keyof typeof themeCopy) ?? 'ru'] || themeCopy.ru;
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    const icon = theme === 'dark' ? 'light_mode' : theme === 'light' ? 'dark_mode' : 'computer';
    const label = theme === 'light' ? copy.dark : theme === 'dark' ? copy.system : copy.light;

    return (
        <button
            type='button'
            onClick={() => setTheme(nextTheme)}
            className='flex items-center cursor-pointer hover:text-dark-orange transition-colors duration-200'
            aria-label={label}
            title={label}
        >
            <span className='material-symbols-outlined'>
                {icon}
            </span>
        </button>
    );
}

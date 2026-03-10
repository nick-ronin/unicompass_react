'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    const icon = theme === 'dark' ? 'light_mode' : theme === 'light' ? 'dark_mode' : 'computer';
    const label = theme === 'light' ? 'Тёмная тема' : theme === 'dark' ? 'Системная тема' : 'Светлая тема';

    return (
        <button
            type='button'
            onClick={() => setTheme(nextTheme)}
            className='flex items-center cursor-pointer hover:text-dark-orange transition-colors duration-200'
            aria-label={label}
            title={label}
        >
            <span className='icon'>
                {icon}
            </span>
        </button>
    );
}

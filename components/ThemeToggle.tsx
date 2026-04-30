'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import MaterialIcon from '@/components/MaterialIcon';

interface ThemeToggleProps {
    lang?: string;
}

const themeCopy = {
    ru: {
        dark: 'Темная тема',
        light: 'Светлая тема',
    },
    en: {
        dark: 'Dark theme',
        light: 'Light theme',
    },
};

export default function ThemeToggle({ lang = 'ru' }: ThemeToggleProps) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const copy = themeCopy[(lang as keyof typeof themeCopy) ?? 'ru'] || themeCopy.ru;
    const effectiveTheme = (theme === 'system' ? resolvedTheme : theme) ?? 'light';
    const nextTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    const icon = effectiveTheme === 'dark' ? 'light_mode' : 'dark_mode';
    const label = effectiveTheme === 'light' ? copy.dark : copy.light;

    return (
        <button
            type='button'
            onClick={() => setTheme(nextTheme)}
            className='cursor-pointer inline-flex items-center justify-center rounded-full p-2 text-lg transition-colors duration-200 hover:text-dark-orange'
            aria-label={label}
            title={label}
        >
            <MaterialIcon name={icon} size='md'/>
        </button>
    );
}

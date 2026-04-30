'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import MaterialIcon from '@/components/MaterialIcon';

interface DropdownProps {
    label?: string;
    options: string[];
    onSelect?: (option: string) => void;
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    lang?: 'ru' | 'en';
}

//TODO: add fixed width to dropdown and add keyboard input support

export default function Dropdown({ label, options, onSelect, className, defaultValue = '', placeholder, lang = 'ru' }: DropdownProps) {
    const translations = {
        ru: { select: 'Выбрать...' },
        en: { select: 'Select...' },
    };

    const t = translations[lang] || translations.ru;
    const [selected, setSelected] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelected(defaultValue || '');
    }, [defaultValue]);

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
        onSelect?.(option);
    };

    return (
        <div className={cn('relative flex flex-col gap-2', className)}>
            {label && <p className='text-lg sm:text-xl'>{label}</p>}
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex w-full items-center justify-between rounded-2xl bg-light-blue-gray px-3 py-2.5 text-sm cursor-pointer dark:bg-surface dark:text-white sm:px-4 sm:py-3 sm:text-base'
            >
                <span>{selected || placeholder || t.select}</span>
                <MaterialIcon name='stat_minus' className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>
            {isOpen && (
                <div className='absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white shadow-lg dark:bg-surface dark:text-white'>
                    {options.map((option) => (
                        <button
                            key={option}
                            type='button'
                            onClick={() => handleSelect(option)}
                            className={cn(
                                'w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-light-blue-gray dark:hover:bg-surface-secondary sm:py-3 sm:text-base',
                                selected === option && 'bg-light-blue-gray dark:bg-surface-secondary font-medium'
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
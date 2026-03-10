'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
    label?: string;
    options: string[];
    onSelect?: (option: string) => void;
    className?: string;
    defaultValue?: string;
}

export default function Dropdown({ label, options, onSelect, className, defaultValue = '' }: DropdownProps) {
    const [selected, setSelected] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
        onSelect?.(option);
    };

    return (
        <div className={cn('flex flex-col gap-2 relative', className)}>
            {label && <p className='text-sm text-gray'>{label}</p>}
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center justify-between px-4 py-3 rounded-2xl bg-light-blue-gray cursor-pointer'
            >
                <span>{selected || 'Выберите...'}</span>
                <span className={cn('icon transition-transform duration-200', isOpen && 'rotate-180')}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div className='absolute top-full mt-1 left-0 right-0 bg-white rounded-2xl shadow-lg z-10 overflow-hidden'>
                    {options.map((option) => (
                        <button
                            key={option}
                            type='button'
                            onClick={() => handleSelect(option)}
                            className={cn(
                                'w-full text-left px-4 py-3 cursor-pointer hover:bg-light-blue-gray transition-colors duration-150',
                                selected === option && 'bg-light-blue-gray font-medium'
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
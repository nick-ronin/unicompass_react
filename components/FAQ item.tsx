'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
    question: string;
    answer: string;
    className?: string;
}

export default function FAQItem({ question, answer, className }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={cn(
                'bg-light-blue-gray dark:bg-surface rounded-2xl w-full transition-all duration-300',
                className
            )}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-5 cursor-pointer"
            >
                <span className="text-xl font-medium text-black dark:text-white">{question}</span>
                <span className="icon text-black dark:text-white select-none">
                    {isOpen ? 'remove' : 'add'}
                </span>
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 text-xl',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="px-6 pb-5 text-black dark:text-white">
                    {answer}
                </div>
            </div>
        </div>
    );
}

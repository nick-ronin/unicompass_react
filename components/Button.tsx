import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export default function Button({children, onClick, type = 'button', className = '' }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} className={cn`px-4 py-2 rounded-2xl cursor-pointer ${className}`}>
            {children}
        </button>
    );
}
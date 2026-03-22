import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right'; // by default on the left
    disabled?: boolean;
}

export default function Button({
    children,
    onClick,
    type = 'button',
    className = '',
    icon,
    iconPosition = 'left',
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'px-4 py-2 rounded-2xl cursor-pointer inline-flex items-center gap-2 transition-colors duration-200',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {icon && iconPosition === 'left' && <span className='inline-flex items-center'>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className='inline-flex items-center'>{icon}</span>}
        </button>
    );
}
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right'; // по дефолту слева
}

export default function Button({
    children,
    onClick,
    type = 'button',
    className = '',
    icon,
    iconPosition = 'left',
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={cn(
                'px-4 py-2 rounded-2xl cursor-pointer inline-flex items-center gap-2',
                className
            )}
        >
            {icon && iconPosition === 'left' && <span className='inline-flex items-center'>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className='inline-flex items-center'>{icon}</span>}
        </button>
    );
}
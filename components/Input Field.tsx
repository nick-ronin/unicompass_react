import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    containerClassName?: string;
}

export default function InputField({
    icon,
    containerClassName,
    className,
    type = 'text',
    placeholder = 'Placeholder',
    ...props
}: InputFieldProps) {
    const baseInputClasses = 'py-3 rounded-2xl bg-light-blue-gray text-black outline-none focus:ring-2 focus:ring-cyan focus:bg-white dark:bg-surface dark:text-white dark:focus:bg-surface transition-colors duration-150 w-full';

    if (icon) {
        return (
            <div className={cn('relative text-black dark:text-white', containerClassName)}>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={cn(baseInputClasses, 'pl-12 pr-4', className)}
                    {...props}
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    {icon}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('relative text-black', containerClassName)}>
            <input
                type={type}
                placeholder={placeholder}
                className={cn(baseInputClasses, 'px-4', className)}
                {...props}
            />
        </div>
    );
}
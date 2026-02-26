import { ReactNode } from 'react';

interface InputProps {
    className?: string;
    icon?: ReactNode;
}

export default function InputField(icon, className, type='text',) { 
    return (
            <div className="relative text-black">
                <input type="text" name="name" placeholder="Placeholder" className={`px-4 py-2 rounded-2xl bg-light-blue-gray ${className}`}/>
            </div>
    );
}
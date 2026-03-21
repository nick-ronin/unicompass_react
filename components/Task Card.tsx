'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Dropdown from './Dropdown';
import Button from './Button';

interface TaskCardProps {
    name: string;
    description: string;
    deadline: string;
    status?: 'completed' | 'in-progress' | 'not completed';
    color?: string;
    className?: string;
}

const statusMap: Record<string, string> = {
    'Выполнена': 'completed',
    'В процессе': 'in-progress',
    'Не выполнена': 'not completed',
};

const statusLabelMap: Record<string, string> = {
    'completed': 'Выполнена',
    'in-progress': 'В процессе',
    'not completed': 'Не выполнена',
};

const statusGradientMap: Record<string, string> = {
    'completed': 'bg-gradient-to-t from-cyan to-light-green',
    'in-progress': 'bg-gradient-to-t from-light-orange to-yellow',
    'not completed': 'bg-gradient-to-t from-dark-red to-orange',
};

export default function TaskCard({ name, description, deadline, status = 'not completed', color, className }: TaskCardProps) {
    const [currentStatus, setCurrentStatus] = useState(status);

    const handleStatusChange = (option: string) => {
        const mapped = statusMap[option];
        if (mapped) setCurrentStatus(mapped as TaskCardProps['status'] & string);
    };

    return (
        <div className={cn('flex flex-col gap-3 p-6 rounded-4xl shadow-md max-w-60 h-64 cursor-pointer text-white transition-transform duration-200 ease-in-out hover:scale-101 hover:shadow-xl', statusGradientMap[currentStatus], className)} style={color ? { borderLeft: `4px solid ${color}` } : undefined}>
            <h3 className='text-xl font-medium'>{name}</h3>
            <p className=''>{description}</p>
                <p className='text-sm flex items-center gap-1'>
                    <span className='material-symbols-outlined'>calendar_today</span>
                    {deadline}
                </p>
                <Dropdown
                    options={["Выполнена", "В процессе", "Не выполнена"]}
                    onSelect={handleStatusChange}
                    defaultValue={statusLabelMap[currentStatus]}
                    className='w-48 text-black'
                />
                {currentStatus === 'completed' && (
                    <Button className='bg-white text-black self-start w-full' icon={<span className='material-symbols-outlined'>add</span>}>Подтвердить</Button>
                )}
        </div>
    );
}
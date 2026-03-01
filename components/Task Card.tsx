import { ReactNode } from 'react';

interface TaskCardProps {
    name: string;
    description: string;
    deadline: string;
    status: 'completed' | 'in-progress' | 'not completed';
    color: string;
}

export default function TaskCard({ name, description, deadline, status, color }: TaskCardProps) {
    return (
        <div className='flex flex-col gap-6 '>
            <h3 className=''>{name}</h3>
            <p className=''>{description}</p>
            <p className=''>{deadline}</p>
            <span className=''>{status}</span>
        </div>
    );
}
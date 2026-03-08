import { ReactNode } from 'react';
import Dropdown from './Dropdown';

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
            <Dropdown options={["Выполнена", "В процессе", "Не выполнена"]} onSelect={(option) => console.log(option)}/>
        </div>
    );
}
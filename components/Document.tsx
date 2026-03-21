import Image from 'next/image';
import { ReactNode } from 'react';
import Button from './Button';

interface DocumentProps {
    name?: ReactNode;
    image: ReactNode;
}

export default function Document({ name, image }: DocumentProps) {
  return (
    <div className='w-fit hover:scale-101 hover:-translate-y-0.5 hover:translate-x-0.5 duration-700 cursor-pointer group'>
        <div className='flex items-center justify-between gap-2'>
            <p className='text-lg pl-3 text-dark-gray dark:text-white'>{name}</p>
            <div className='flex justify-end pr-3 gap-1'>
                <Button className='px-0 py-0 text-dark-gray dark:text-white hover:text-cyan dark:hover:text-cyan' icon={<span className='material-symbols-outlined'>send</span>}></Button>
                <Button className='px-0 py-0 text-dark-gray dark:text-white hover:text-cyan dark:hover:text-cyan' icon={<span className='material-symbols-outlined'>download</span>}></Button>
            </div>
        </div>
        <div className='px-3 py-3 bg-light-blue-gray dark:bg-surface rounded-2xl w-fit'>
            {image}
        </div>
    </div>
    );
}
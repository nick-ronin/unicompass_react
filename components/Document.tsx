import Image from 'next/image';
import { ReactNode } from 'react';
import Button from './Button';

interface DocumentProps {
    name?: ReactNode;
    image: ReactNode;
}

export default function Document({ name, image }: DocumentProps) {
  return (
    <div className='w-fit'>
        <div className='flex items-center justify-between'>
            <p className='text-lg pl-3'>{name}</p>
            <div className='flex justify-end pr-3'>
                <Button className='px-0 py-0' icon={<span className='icon icon-rounded icon-filled'>send</span>}></Button>
                <Button className='px-0 py-0' icon={<span className='icon icon-rounded'>download</span>}></Button>
            </div>
        </div>
        <div className='px-3 py-3 bg-light-blue-gray rounded-2xl w-fit'>
            {image}
        </div>
    </div>
    );
}
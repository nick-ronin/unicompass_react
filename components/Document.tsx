import { ReactNode } from 'react';
import Button from './Button';
import MaterialIcon from '@/components/MaterialIcon';

interface DocumentProps {
    name?: ReactNode;
    image: ReactNode;
}

export default function Document({ name, image }: DocumentProps) {
  return (
    <div className='group w-full cursor-pointer duration-700 hover:-translate-y-0.5 hover:scale-[1.01]'>
        <div className='flex items-start justify-between gap-2'>
            <p className='pl-2 text-base text-dark-gray dark:text-white sm:pl-3 sm:text-lg'>{name}</p>
            <div className='flex justify-end gap-1 pr-2 sm:pr-3'>
                <Button className='px-0 py-0 text-dark-gray dark:text-white hover:text-cyan dark:hover:text-cyan' icon={<MaterialIcon name='send' />} />
                <Button className='px-0 py-0 text-dark-gray dark:text-white hover:text-cyan dark:hover:text-cyan' icon={<MaterialIcon name='download' />} />
            </div>
        </div>
        <div className='w-full rounded-2xl bg-light-blue-gray px-2 py-2 dark:bg-surface sm:px-3 sm:py-3'>
            {image}
        </div>
    </div>
    );
}
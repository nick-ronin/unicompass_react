import Link from 'next/link';
import { ReactNode } from 'react';

interface TableCardProps {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  count?: number;
}

export default function TableCard({ href, title, description, icon, count }: TableCardProps) {
  return (
    <Link href={href}>
      <div className='bg-white dark:bg-surface rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer border border-light-blue-gray dark:border-surface hover:border-dark-cyan dark:hover:border-cyan'>
        <div className='flex items-start justify-between mb-3'>
          {icon && <div className='text-3xl text-dark-cyan dark:text-cyan'>{icon}</div>}
          {count !== undefined && (
            <div className='bg-light-blue-gray dark:bg-dark-cyan/30 text-dark-cyan dark:text-white px-3 py-1 rounded-full text-sm font-semibold'>
              {count}
            </div>
          )}
        </div>
        <h3 className='text-xl font-bold text-dark-gray dark:text-white mb-2'>{title}</h3>
        <p className='text-medium-blue-gray dark:text-light-blue-gray text-sm'>{description}</p>
      </div>
    </Link>
  );
}

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
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'>
        <div className='flex items-start justify-between mb-3'>
          {icon && <div className='text-3xl text-blue-600 dark:text-blue-400'>{icon}</div>}
          {count !== undefined && (
            <div className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-semibold'>
              {count}
            </div>
          )}
        </div>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h3>
        <p className='text-gray-600 dark:text-gray-300 text-sm'>{description}</p>
      </div>
    </Link>
  );
}

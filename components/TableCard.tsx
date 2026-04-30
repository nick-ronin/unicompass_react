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
      <div className='cursor-pointer rounded-lg border border-light-blue-gray bg-white p-4 shadow-md transition-all duration-200 hover:border-dark-cyan hover:shadow-lg dark:border-surface dark:bg-surface dark:hover:border-cyan sm:p-6'>
        <div className='flex items-start justify-between mb-3'>
          {icon && <div className='text-2xl text-dark-cyan dark:text-cyan sm:text-3xl'>{icon}</div>}
          {count !== undefined && (
            <div className='rounded-full bg-light-blue-gray px-2.5 py-1 text-xs font-semibold text-dark-cyan dark:bg-dark-cyan/30 dark:text-white sm:px-3 sm:text-sm'>
              {count}
            </div>
          )}
        </div>
        <h3 className='mb-2 text-lg font-bold text-dark-gray dark:text-white sm:text-xl'>{title}</h3>
        <p className='text-sm text-medium-blue-gray dark:text-light-blue-gray'>{description}</p>
      </div>
    </Link>
  );
}

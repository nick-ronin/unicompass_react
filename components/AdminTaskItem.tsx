'use client';

import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import MaterialIcon from '@/components/MaterialIcon';

interface AdminTaskItemProps {
  id: string;
  name: string;
  description: string;
  completionPercent: number;
  onEdit?: (id: string) => void;
  onAssign?: (id: string) => void;
  view?: 'list' | 'grid';
  task?: Task;
  isLoading?: boolean;
  lang?: string;
}

const getCompletionColor = (percent: number): string => {
  if (percent >= 80) return 'bg-light-green';
  if (percent >= 50) return 'bg-yellow';
  if (percent >= 25) return 'bg-light-orange';
  return 'bg-orange';
};

const copy = {
  en: {
    assign: 'Assign task',
    edit: 'Edit task',
    completion: 'Completed by students',
  },
  ru: {
    assign: 'Назначить задачу',
    edit: 'Редактировать задачу',
    completion: 'Выполнено студентами',
  },
};

export default function AdminTaskItem({
  id,
  name,
  description,
  completionPercent,
  onEdit,
  onAssign,
  view = 'list',
  task,
  isLoading = false,
  lang = 'ru',
}: AdminTaskItemProps) {
  const completionColor = getCompletionColor(completionPercent);
  const t = copy[(lang as keyof typeof copy) ?? 'ru'] || copy.ru;

  if (isLoading) {
    return (
      <div className={cn(
        'bg-white dark:bg-surface rounded-2xl p-4 animate-pulse sm:p-6',
        view === 'grid' ? 'shadow-md' : 'shadow-sm'
      )}>
        <div className='h-12 bg-light-blue-gray rounded mb-4'></div>
        <div className='h-6 bg-light-blue-gray rounded mb-4'></div>
        <div className='h-3 bg-light-blue-gray rounded'></div>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-surface sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h3 className='text-base font-semibold text-dark-gray line-clamp-2 dark:text-white sm:text-lg'>
              {name}
            </h3>
            <p className='mt-2 line-clamp-2 text-sm text-gray dark:text-medium-blue-gray'>
              {description}
            </p>
          </div>
          <div className='flex items-center gap-2 self-end sm:self-auto'>
            <button
              onClick={() => onAssign?.(id)}
              className='shrink-0 cursor-pointer rounded-lg p-2 text-dark-cyan transition-colors hover:bg-light-blue-gray hover:text-cyan dark:text-cyan dark:hover:bg-dark-gray dark:hover:text-cyan'
              aria-label={t.assign}
            >
              <MaterialIcon name='person_add' className='text-xl sm:text-2xl' />
            </button>
            <button
              onClick={() => onEdit?.(id)}
              className='shrink-0 cursor-pointer rounded-lg p-2 text-orange transition-colors hover:bg-light-blue-gray hover:text-dark-orange dark:hover:bg-dark-gray'
              aria-label={t.edit}
            >
              <MaterialIcon name='edit' className='text-xl sm:text-2xl' />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-2 border-t border-light-blue-gray pt-2 dark:border-dark-gray'>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-gray dark:text-medium-blue-gray uppercase tracking-wide'>
                {t.completion}
            </span>
            <span className={`text-base font-bold ${completionColor.replace('bg-', 'text-')} sm:text-lg`}>
              {completionPercent}%
            </span>
          </div>
          <div className='w-full h-2.5 bg-light-blue-gray dark:bg-dark-gray rounded-full overflow-hidden'>
            <div
              className={`h-full ${completionColor} transition-all duration-300`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-surface sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
      <div className='flex flex-1 min-w-0 items-center gap-4'>

        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-dark-gray dark:text-white truncate'>
            {name}
          </h3>
          <p className='text-sm text-gray dark:text-medium-blue-gray truncate'>
            {description}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4 sm:gap-6'>
        <div className='flex flex-col items-end gap-2'>
          <span className={`text-base font-bold ${completionColor.replace('bg-', 'text-')} sm:text-lg`}>
            {completionPercent}%
          </span>
          <div className='h-2 w-20 overflow-hidden rounded-full bg-light-blue-gray dark:bg-dark-gray sm:w-24'>
            <div
              className={`h-full ${completionColor} transition-all duration-300`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => onAssign?.(id)}
          className='shrink-0 cursor-pointer rounded-lg p-2 text-dark-cyan transition-colors hover:bg-light-blue-gray hover:text-cyan dark:text-cyan dark:hover:bg-dark-gray dark:hover:text-cyan'
          aria-label={t.assign}
        >
          <MaterialIcon name='person_add' />
        </button>
        <button
          onClick={() => onEdit?.(id)}
          className='shrink-0 cursor-pointer rounded-lg p-2 text-orange transition-colors hover:bg-light-blue-gray hover:text-dark-orange dark:hover:bg-dark-gray'
          aria-label={t.edit}
        >
          <MaterialIcon name='edit' />
        </button>
      </div>
    </div>
  );
}

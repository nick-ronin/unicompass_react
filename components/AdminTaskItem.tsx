'use client';

import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';

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

const getTaskIcon = (taskName: string): string => {
  if (taskName.includes('Registration')) return 'app_registration';
  if (taskName.includes('билет')) return 'card_membership';
  if (taskName.includes('русском языке') || taskName.includes('язык')) return 'language';
  if (taskName.includes('банк')) return 'account_balance';
  if (taskName.includes('ОМС') || taskName.includes('медицин') || taskName.includes('обследование'))
    return 'local_hospital';
  if (taskName.includes('миграцион')) return 'public';
  if (taskName.includes('кампус') || taskName.includes('экскурсия')) return 'tour';
  return 'task_alt';
};

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
  const icon = getTaskIcon(name);
  const completionColor = getCompletionColor(completionPercent);
  const t = copy[(lang as keyof typeof copy) ?? 'ru'] || copy.ru;

  if (isLoading) {
    return (
      <div className={cn(
        'bg-white dark:bg-surface rounded-2xl p-6 animate-pulse',
        view === 'grid' ? 'shadow-md' : 'shadow-sm'
      )}>
        <div className='h-12 bg-gray-300 rounded mb-4'></div>
        <div className='h-6 bg-gray-300 rounded mb-4'></div>
        <div className='h-3 bg-gray-300 rounded'></div>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className='bg-white dark:bg-surface rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4'>
        <div className='flex items-start gap-4'>
          <div className={`p-3 rounded-xl ${completionColor} text-white shrink-0`}>
            <span className='material-symbols-outlined text-2xl'>{icon}</span>
          </div>
          <div className='ml-auto flex gap-2'>
            <button
              onClick={() => onAssign?.(id)}
              className='shrink-0 text-purple-600 hover:text-purple-700 transition-colors p-2 hover:bg-purple-100 rounded-lg dark:hover:bg-dark-gray dark:text-purple-400 dark:hover:text-purple-300'
              aria-label={t.assign}
            >
              <span className='material-symbols-outlined text-2xl'>person_add</span>
            </button>
            <button
              onClick={() => onEdit?.(id)}
              className='shrink-0 text-orange hover:text-dark-orange transition-colors p-2 hover:bg-light-blue-gray rounded-lg dark:hover:bg-dark-gray'
              aria-label={t.edit}
            >
              <span className='material-symbols-outlined text-2xl'>edit</span>
            </button>
          </div>
        </div>

        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-dark-gray dark:text-white line-clamp-2'>
            {name}
          </h3>
          <p className='text-sm text-gray dark:text-medium-blue-gray line-clamp-2 mt-2'>
            {description}
          </p>
        </div>

        <div className='flex flex-col gap-2 pt-2 border-t border-light-blue-gray dark:border-dark-gray'>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-gray dark:text-medium-blue-gray uppercase tracking-wide'>
                {t.completion}
            </span>
            <span className={`text-lg font-bold ${completionColor.replace('bg-', 'text-')}`}>
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
    <div className='bg-white dark:bg-surface rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between gap-6'>
      <div className='flex items-center gap-4 flex-1 min-w-0'>
        <div className={`p-2.5 rounded-lg ${completionColor} text-white shrink-0`}>
          <span className='material-symbols-outlined text-xl'>{icon}</span>
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-dark-gray dark:text-white truncate'>
            {name}
          </h3>
          <p className='text-sm text-gray dark:text-medium-blue-gray truncate'>
            {description}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-6'>
        <div className='flex flex-col items-end gap-2'>
          <span className={`text-lg font-bold ${completionColor.replace('bg-', 'text-')}`}>
            {completionPercent}%
          </span>
          <div className='w-24 h-2 bg-light-blue-gray dark:bg-dark-gray rounded-full overflow-hidden'>
            <div
              className={`h-full ${completionColor} transition-all duration-300`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => onAssign?.(id)}
          className='text-purple-600 hover:text-purple-700 transition-colors p-2 hover:bg-purple-100 rounded-lg dark:hover:bg-dark-gray dark:text-purple-400 dark:hover:text-purple-300 shrink-0'
          aria-label={t.assign}
        >
          <span className='material-symbols-outlined'>person_add</span>
        </button>
        <button
          onClick={() => onEdit?.(id)}
          className='text-orange hover:text-dark-orange transition-colors p-2 hover:bg-light-blue-gray rounded-lg dark:hover:bg-dark-gray shrink-0'
          aria-label={t.edit}
        >
          <span className='material-symbols-outlined'>edit</span>
        </button>
      </div>
    </div>
  );
}

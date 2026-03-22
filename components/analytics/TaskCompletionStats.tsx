'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

type Lang = 'ru' | 'en';

interface TaskStat {
  id: string;
  name: string;
  completionPercent: number;
  completed: number;
  total: number;
  description: string;
}

const mockTaskStats: TaskStat[] = [
  {
    id: '1',
    name: 'Registration в системе',
    completionPercent: 95,
    completed: 95,
    total: 100,
    description: 'Registration students в системе'
  },
  {
    id: '2',
    name: 'Оформление ОМС',
    completionPercent: 78,
    completed: 78,
    total: 100,
    description: 'Оформление полиса ОМС'
  },
  {
    id: '3',
    name: 'Медосмотр',
    completionPercent: 65,
    completed: 65,
    total: 100,
    description: 'Прохождение медицинского осмотра'
  },
  {
    id: '4',
    name: 'Знание русского языка (тест)',
    completionPercent: 88,
    completed: 88,
    total: 100,
    description: 'Тестирование знания русского языка'
  },
  {
    id: '5',
    name: 'Дактилоскопия',
    completionPercent: 45,
    completed: 45,
    total: 100,
    description: 'Прохождение дактилоскопии'
  },
  {
    id: '6',
    name: 'Миграционная карта',
    completionPercent: 72,
    completed: 72,
    total: 100,
    description: 'Оформление миграционной карты'
  },
  {
    id: '7',
    name: 'Экскурсия по кампусу',
    completionPercent: 55,
    completed: 55,
    total: 100,
    description: 'Посещение экскурсии по кампусу'
  },
  {
    id: '8',
    name: 'Банковский счет',
    completionPercent: 82,
    completed: 82,
    total: 100,
    description: 'Открытие банковского счета'
  },
];

const getTaskIcon = (taskName: string): string => {
  if (taskName.includes('Registration')) return 'app_registration';
  if (taskName.includes('ОМС') || taskName.includes('медицин')) return 'local_hospital';
  if (taskName.includes('русском')) return 'language';
  if (taskName.includes('банк')) return 'account_balance';
  if (taskName.includes('Дактилоскопия')) return 'fingerprint';
  if (taskName.includes('миграцион')) return 'public';
  if (taskName.includes('кампус')) return 'tour';
  return 'task_alt';
};

const translations = {
  en: {
    title: 'Task completion statistics',
    subtitle: 'Overall progress on task completion by students',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    mostCompleted: 'Most completed',
    leastCompleted: 'Least completed',
    allTasks: 'All tasks',
    status: (c: number, t: number) => `${c}/${t}`,
    tasks: {
      'Registration в системе': { name: 'System registration', desc: 'Register students in the system' },
      'Оформление ОМС': { name: 'OMS insurance', desc: 'Medical insurance policy registration' },
      'Медосмотр': { name: 'Medical examination', desc: 'Passing the medical exam' },
      'Знание русского языка (тест)': { name: 'Russian language test', desc: 'Testing Russian language proficiency' },
      'Дактилоскопия': { name: 'Fingerprinting', desc: 'Completing fingerprinting' },
      'Миграционная карта': { name: 'Migration card', desc: 'Issuing a migration card' },
      'Экскурсия по кампусу': { name: 'Campus tour', desc: 'Attending the campus tour' },
      'Банковский счет': { name: 'Bank account', desc: 'Opening a bank account' },
    },
  },
  ru: {
    title: 'Статистика выполнения задач',
    subtitle: 'Общий прогресс выполнения задач студентами',
    sortAsc: 'По возрастанию',
    sortDesc: 'По убыванию',
    mostCompleted: 'Больше всего выполнено',
    leastCompleted: 'Меньше всего выполнено',
    allTasks: 'Все задачи',
    status: (c: number, t: number) => `${c}/${t}`,
  },
};

export default function TaskCompletionStats() {
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const params = useParams();
  const lang = (params?.lang as Lang) || 'ru';
  const t = translations[lang] || translations.ru;

  const sortedTasks = [...mockTaskStats].sort((a, b) => {
    return sortBy === 'desc' ? b.completionPercent - a.completionPercent : a.completionPercent - b.completionPercent;
  });

  const localizeTask = (task: TaskStat): TaskStat => {
    if (lang === 'ru') return task;
    const map = translations.en.tasks as Record<string, { name: string; desc: string }>;
    const localized = map[task.name];
    return {
      ...task,
      name: localized?.name || task.name,
      description: localized?.desc || task.description,
    };
  };

  const localizedSorted = sortedTasks.map(localizeTask);
  const mostCompleted = localizedSorted[0];
  const leastCompleted = localizedSorted[localizedSorted.length - 1];

  return (
    <div className='space-y-8 w-full'>
      {/* Header with sort controls */}
      <div className='bg-white dark:bg-surface rounded-2xl p-6 shadow-lg'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-2xl font-bold text-black dark:text-white'>{t.title}</h2>
          <button
            onClick={() => setSortBy(sortBy === 'desc' ? 'asc' : 'desc')}
            className='flex items-center gap-2 px-4 py-2 rounded-lg bg-light-blue-gray dark:bg-dark-gray hover:bg-blue-gray transition-colors text-black dark:text-white cursor-pointer'
          >
            <span className='material-symbols-outlined'>sort</span>
            {sortBy === 'desc' ? t.sortDesc : t.sortAsc}
          </button>
        </div>
        <p className='text-gray dark:text-medium-warm-gray'>{t.subtitle}</p>
      </div>

      {/* Most and Least Completed - Side by Side */}
      <div className='grid grid-cols-2 gap-4'>
        {/* Most Completed */}
        <div className='space-y-2'>
          <h3 className='text-xs font-bold text-gray dark:text-medium-warm-gray uppercase tracking-wider px-1'>{t.mostCompleted}</h3>
          <div className='bg-gradient-to-br from-light-green via-cyan to-dark-cyan rounded-xl p-4 text-white shadow-lg'>
            <div className='flex items-start gap-2 mb-2'>
              <div className='p-2 bg-white/20 rounded shrink-0'>
                <span className='material-symbols-outlined text-lg'>{getTaskIcon(mostCompleted.name)}</span>
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='text-xs font-bold leading-tight'>{mostCompleted.name}</h4>
                <p className='text-xs text-white/70 line-clamp-1'>{mostCompleted.description}</p>
              </div>
            </div>
            <div className='w-full bg-white/20 rounded-full h-1 mb-2'>
              <div className='h-1 rounded-full bg-white' style={{ width: `${mostCompleted.completionPercent}%` }} />
            </div>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-white/80'>{t.status(mostCompleted.completed, mostCompleted.total)}</span>
              <span className='font-bold'>{mostCompleted.completionPercent}%</span>
            </div>
          </div>
        </div>

        {/* Least Completed */}
        <div className='space-y-2'>
          <h3 className='text-xs font-bold text-gray dark:text-medium-warm-gray uppercase tracking-wider px-1'>{t.leastCompleted}</h3>
          <div className='bg-gradient-to-br from-medium-blue-gray via-medium-warm-gray to-gray dark:from-medium-warm-gray dark:via-gray dark:to-dark-cyan border-l-4 border-medium-blue-gray rounded-xl p-4 text-white shadow-lg'>
            <div className='flex items-start gap-2 mb-2'>
              <div className='p-2 bg-white/20 rounded shrink-0'>
                <span className='material-symbols-outlined text-lg'>{getTaskIcon(leastCompleted.name)}</span>
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='text-xs font-bold leading-tight'>{leastCompleted.name}</h4>
                <p className='text-xs text-white/70 line-clamp-1'>{leastCompleted.description}</p>
              </div>
            </div>
            <div className='w-full bg-white/20 rounded-full h-1 mb-2'>
              <div className='h-1 rounded-full bg-white' style={{ width: `${leastCompleted.completionPercent}%` }} />
            </div>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-white/80'>{t.status(leastCompleted.completed, leastCompleted.total)}</span>
              <span className='font-bold'>{leastCompleted.completionPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Tasks List - Expandable */}
      <div className='bg-white dark:bg-surface rounded-2xl shadow-lg'>
        <button
          onClick={() => setIsTasksExpanded(!isTasksExpanded)}
          className='w-full flex justify-between items-center p-6 hover:bg-light-blue-gray dark:hover:bg-dark-gray rounded-2xl transition-colors cursor-pointer'
        >
          <h3 className='text-lg font-bold text-black dark:text-white'>{t.allTasks}</h3>
          <span
            className='material-symbols-outlined text-black dark:text-white transition-transform'
            style={{ transform: isTasksExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            expand_more
          </span>
        </button>

        {isTasksExpanded && (
          <div className='border-t border-light-blue-gray dark:border-gray p-6 space-y-3'>
            {localizedSorted.map((task) => (
              <div
                key={task.id}
                className='flex items-center justify-between p-3 rounded-lg bg-light-blue-gray dark:bg-dark-gray hover:bg-blue-gray dark:hover:bg-gray transition-colors'
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='p-2 bg-white dark:bg-surface rounded'>
                    <span className='material-symbols-outlined text-sm text-black dark:text-white'>{getTaskIcon(task.name)}</span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-black dark:text-white leading-tight'>{task.name}</p>
                    <p className='text-xs text-gray dark:text-medium-warm-gray line-clamp-1'>{task.description}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2 ml-4 shrink-0'>
                  <div className='w-20 bg-light-blue-gray dark:bg-gray rounded-full h-1.5'>
                    <div
                      className={`h-1.5 rounded-full ${
                        task.completionPercent >= 75
                          ? 'bg-light-green'
                          : task.completionPercent >= 50
                          ? 'bg-yellow'
                          : 'bg-orange'
                      }`}
                      style={{ width: `${task.completionPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold min-w-fit ${
                      task.completionPercent >= 75
                        ? 'text-light-green'
                        : task.completionPercent >= 50
                        ? 'text-yellow'
                        : 'text-orange'
                    }`}
                  >
                    {task.completionPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

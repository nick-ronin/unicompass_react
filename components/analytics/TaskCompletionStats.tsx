'use client';

import { useState, useEffect, useCallback } from 'react';
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
    tasks: {},
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
  const [taskStats, setTaskStats] = useState<TaskStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const lang = (params?.lang as Lang) || 'ru';
  const t = translations[lang] || translations.ru;

  const normalizePercent = (analytics: any) => {
    const raw =
      analytics?.completed_percent ??
      analytics?.completion_percent ??
      analytics?.completedPercent ??
      analytics?.completionPercent ??
      analytics?.completed;
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
  };

  const fetchTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tasksResponse = await fetch('/api/task');
      if (!tasksResponse.ok) {
        throw new Error(`Error loading tasks: ${tasksResponse.status}`);
      }

      const rawTasks = await tasksResponse.json();
      const formattedTasks = (Array.isArray(rawTasks) ? rawTasks : rawTasks.results || []).map(
        (task: any, index: number) => ({
          id: task.id?.toString() || (index + 1).toString(),
          name: task.name || task.title || 'Untitled',
          description: task.description || '',
        })
      );

      const withAnalytics = await Promise.all(
        formattedTasks.map(async (task: { id: string; name: string; description: string }) => {
          try {
            const analyticsResponse = await fetch(`/api/student_task/analytics/task/${task.id}`);

            if (!analyticsResponse.ok) {
              throw new Error(`Analytics load failed: ${analyticsResponse.status}`);
            }

            const analytics = await analyticsResponse.json();
            return {
              id: task.id,
              name: task.name,
              description: task.description,
              completionPercent: normalizePercent(analytics),
              completed: Number(analytics?.completed) || 0,
              total: Number(analytics?.total_assigned) || 0,
            } as TaskStat;
          } catch (analyticsError) {
            console.error('Error loading task analytics:', analyticsError);
            return {
              id: task.id,
              name: task.name,
              description: task.description,
              completionPercent: 0,
              completed: 0,
              total: 0,
            } as TaskStat;
          }
        })
      );

      setTaskStats(withAnalytics);
    } catch (err) {
      console.error('Error loading task stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  const sortedTasks = [...taskStats].sort((a, b) => {
    return sortBy === 'desc' ? b.completionPercent - a.completionPercent : a.completionPercent - b.completionPercent;
  });

  const localizeTask = (task: TaskStat): TaskStat => {
    if (lang === 'ru') return task;
    return task;
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

      {loading && (
        <div className='bg-white dark:bg-surface rounded-2xl p-6 shadow-lg animate-pulse space-y-4'>
          <div className='h-4 bg-light-blue-gray rounded w-1/3'></div>
          <div className='h-3 bg-light-blue-gray rounded w-2/3'></div>
          <div className='h-52 bg-light-blue-gray rounded'></div>
        </div>
      )}

      {!loading && error && (
        <div className='bg-light-orange dark:bg-dark-red text-dark-gray dark:text-white rounded-2xl p-4 shadow-lg'>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && localizedSorted.length === 0 && (
        <div className='bg-white dark:bg-surface rounded-2xl p-6 shadow-lg text-center text-gray dark:text-medium-warm-gray'>
          Нет задач для отображения
        </div>
      )}

      {!loading && !error && localizedSorted.length > 0 && (
        <>
          {/* Most and Least Completed - Side by Side */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Most Completed */}
            {mostCompleted && (
              <div className='space-y-2'>
                <h3 className='text-xs font-bold text-gray dark:text-medium-warm-gray uppercase tracking-wider px-1'>{t.mostCompleted}</h3>
                <div className='bg-linear-to-br from-light-green via-cyan to-dark-cyan rounded-xl p-4 text-white shadow-lg'>
                  <div className='flex items-start gap-2 mb-2'>
                    <div className='p-2 bg-white/20 rounded shrink-0'>
                      <span className='material-symbols-outlined text-lg'>{getTaskIcon(mostCompleted.name)}</span>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='text-xl leading-tight'>{mostCompleted.name}</h4>
                      <p className='text-md text-white/70 line-clamp-1'>{mostCompleted.description}</p>
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
            )}

            {/* Least Completed */}
            {leastCompleted && (
              <div className='space-y-2'>
                <h3 className='text-xs font-bold text-gray dark:text-medium-warm-gray uppercase tracking-wider px-1'>{t.leastCompleted}</h3>
                <div className='bg-linear-to-br from-light-orange via-orange to-dark-red rounded-xl p-4 text-white shadow-lg'>
                  <div className='flex items-start gap-2 mb-2'>
                    <div className='p-2 bg-white/20 rounded shrink-0'>
                      <span className='material-symbols-outlined text-lg'>{getTaskIcon(leastCompleted.name)}</span>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='text-xl leading-tight'>{leastCompleted.name}</h4>
                      <p className='text-md text-white/70 line-clamp-1'>{leastCompleted.description}</p>
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
            )}
          </div>

          {/* All Tasks List - Expandable */}
          <div className='bg-white dark:bg-surface rounded-2xl shadow-lg'>
            <button
              onClick={() => setIsTasksExpanded(!isTasksExpanded)}
              className='w-full flex justify-between items-center p-6 hover:bg-light-blue-gray dark:hover:bg-surface-secondary rounded-2xl transition-colors cursor-pointer'
            >
              <h3 className='text-xl text-black dark:text-white'>{t.allTasks}</h3>
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
                    className='flex items-center justify-between py-4 px-6 rounded-2xl bg-light-blue-gray dark:bg-dark-gray hover:bg-blue-gray dark:hover:bg-surface-secondary transition-colors'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='flex-1 min-w-0'>
                        <p className='text-xl text-black dark:text-white leading-tight'>{task.name}</p>
                        <p className='text-md text-gray dark:text-medium-warm-gray line-clamp-1'>{task.description}</p>
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
                        className={`text-md font-bold min-w-fit ${
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
        </>
      )}
    </div>
  );
}

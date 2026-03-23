'use client';

import { useEffect, useMemo, useState } from 'react';
import TaskCard from '@/components/Task Card';
import Dropdown from '@/components/Dropdown';
import InputField from '@/components/Input Field';
import { useParams } from 'next/navigation';

type TaskStatus = 'completed' | 'in-progress' | 'not completed';

interface StudentTask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: TaskStatus;
}

interface StoredStudentAuth {
  username?: string;
  studentId?: string | null;
}

const sortOptions = ['Name', 'Deadline', 'Status'] as const;
const filterOptions = ['All', 'Completed', 'In progress', 'Not completed'] as const;

type SortOption = (typeof sortOptions)[number];
type FilterOption = (typeof filterOptions)[number];

const normalizeStatus = (value: unknown): TaskStatus => {
  if (typeof value === 'boolean') {
    return value ? 'completed' : 'not completed';
  }

  if (typeof value !== 'string') {
    return 'not completed';
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'completed' || normalized === 'done' || normalized === 'completed') {
    return 'completed';
  }
  if (normalized === 'in-progress' || normalized === 'in progress' || normalized === 'in progress') {
    return 'in-progress';
  }
  return 'not completed';
};

const getResponseList = (raw: any): any[] => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
};

const getDaysToDeadline = (deadline: string): number => {
  if (!deadline) return Number.POSITIVE_INFINITY;
  const end = new Date(deadline);
  if (Number.isNaN(end.getTime())) return Number.POSITIVE_INFINITY;

  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const mapTask = (entry: any, index: number): StudentTask => {
  const taskSource = entry?.task || entry;

  const taskId =
    taskSource?.id ??
    entry?.task_id ??
    entry?.id ??
    `${index + 1}`;

  const name =
    taskSource?.name ||
    taskSource?.title ||
    entry?.task_name ||
    entry?.task_title ||
    'Untitled';

  const description =
    taskSource?.description ||
    entry?.description ||
    '';

  const rawDeadline =
    taskSource?.deadline ??
    taskSource?.due_date ??
    entry?.deadline ??
    entry?.due_date ??
    null;

  const deadline = rawDeadline ? String(rawDeadline) : '';

  const status = normalizeStatus(
    entry?.status ?? taskSource?.status ?? entry?.completed ?? taskSource?.completed
  );

  return {
    id: String(taskId),
    name,
    description,
    deadline,
    status,
  };
};

export default function TasksPage() {
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : Array.isArray(params.lang) ? params.lang[0] : 'ru';
  const translations = {
    ru: {
      title: 'Мои задачи',
      subtitle: 'Управляйте и отслеживайте задачи в одном месте',
      sorting: 'Сортировка',
      filter: 'Фильтр',
      searchPlaceholder: 'Поиск задач...',
      loading: 'Загрузка задач...',
      errorFallback: 'Не удалось загрузить задачи.',
      allTasksCard: 'Все задачи',
      completedCard: 'Выполнено',
      urgentCard: 'Срочные',
      urgentBlock: 'Срочные задачи',
      urgentEmpty: 'Нет срочных задач',
      allTasksHeading: 'Все задачи',
      noTasks: 'Задачи не найдены',
      sortLabels: { Name: 'По имени', Deadline: 'По дедлайну', Status: 'По статусу' },
      filterLabels: { All: 'Все', Completed: 'Выполнено', 'In progress': 'В процессе', 'Not completed': 'Не выполнено' },
      loadingUser: 'Пользователь не найден. Выполните вход повторно.',
      identifyError: 'Ошибка определения пользователя:',
      loadError: 'Ошибка загрузки задач:',
    },
    en: {
      title: 'My tasks',
      subtitle: 'Manage and track your tasks in one place',
      sorting: 'Sorting',
      filter: 'Filter',
      searchPlaceholder: 'Search tasks...',
      loading: 'Loading tasks...',
      errorFallback: 'Failed to load tasks.',
      allTasksCard: 'All tasks',
      completedCard: 'Completed',
      urgentCard: 'Urgent',
      urgentBlock: 'Urgent tasks',
      urgentEmpty: 'No urgent tasks',
      allTasksHeading: 'All tasks',
      noTasks: 'No tasks found',
      sortLabels: { Name: 'Name', Deadline: 'Deadline', Status: 'Status' },
      filterLabels: { All: 'All', Completed: 'Completed', 'In progress': 'In progress', 'Not completed': 'Not completed' },
      loadingUser: 'No active user found. Please sign in again.',
      identifyError: 'Error identifying user:',
      loadError: 'Error loading tasks:',
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.ru;
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSort, setSelectedSort] = useState<SortOption>('Name');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    const normalized = normalizeStatus(newStatus);
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: normalized } : task))
    );
  };

  useEffect(() => {
    const loadStudentTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const authRaw = localStorage.getItem('studentAuth');
        if (!authRaw) {
          throw new Error(t.loadingUser);
        }

        const auth = JSON.parse(authRaw) as StoredStudentAuth;
        const username = auth.username?.trim() || '';
        let studentId = auth.studentId?.toString() || '';

        if (!studentId && username) {
          const studentsResponse = await fetch('/api/student/full_info_list');
          if (!studentsResponse.ok) {
            throw new Error(`${t.identifyError} ${studentsResponse.status}`);
          }

          const studentsRaw = await studentsResponse.json();
          const students = getResponseList(studentsRaw);
          const matchedStudent = students.find((student: any) =>
            String(student?.login || '').trim().toLowerCase() === username.toLowerCase()
          );

          if (matchedStudent?.id) {
            studentId = String(matchedStudent.id);
            localStorage.setItem(
              'studentAuth',
              JSON.stringify({ username, studentId })
            );
          }
        }

        if (!studentId) {
          throw new Error(t.loadingUser);
        }

        const endpointCandidates = [
          `/api/student_task/student/${studentId}`,
          `/api//student_task/student/${studentId}`,
        ];

        let tasksRaw: any = null;
        let lastStatus: number | null = null;

        for (const endpoint of endpointCandidates) {
          const response = await fetch(endpoint);
          if (response.ok) {
            tasksRaw = await response.json();
            break;
          }
          lastStatus = response.status;
        }

        if (!tasksRaw) {
          throw new Error(`${t.loadError} ${lastStatus ?? 'unknown'}`);
        }

        const taskList = getResponseList(tasksRaw).map(mapTask);
        setTasks(taskList);
      } catch (err) {
        console.error('Error loading tasks student:', err);
        setError(err instanceof Error ? err.message : t.errorFallback);
      } finally {
        setLoading(false);
      }
    };

    loadStudentTasks();
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== 'All') {
      const statusByFilter: Record<Exclude<FilterOption, 'All'>, TaskStatus> = {
        Completed: 'completed',
        'In progress': 'in-progress',
        'Not completed': 'not completed',
      };
      const status = statusByFilter[selectedFilter as Exclude<FilterOption, 'All'>];
      result = result.filter((task) => task.status === status);
    }

    result.sort((a, b) => {
      if (selectedSort === 'Name') {
        return a.name.localeCompare(b.name, lang === 'en' ? 'en' : 'ru');
      }

      if (selectedSort === 'Deadline') {
        const daysA = getDaysToDeadline(a.deadline);
        const daysB = getDaysToDeadline(b.deadline);
        return daysA - daysB;
      }

      const statusOrder: Record<TaskStatus, number> = {
        'in-progress': 0,
        'not completed': 1,
        'completed': 2,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return result;
  }, [tasks, searchQuery, selectedFilter, selectedSort]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  // Apply the active filters/search before picking urgent tasks so they stay in sync with the list
  const filteredUrgentCandidates = filteredAndSortedTasks.filter((task) => task.status !== 'completed');
  const urgentTasks = filteredUrgentCandidates
    .slice()
    .sort((a, b) => getDaysToDeadline(a.deadline) - getDaysToDeadline(b.deadline))
    .slice(0, 3);

  const urgentIds = new Set(urgentTasks.map((task) => task.id));
  const nonUrgentFilteredTasks = filteredAndSortedTasks.filter((task) => !urgentIds.has(task.id));

  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const urgentPercent = filteredAndSortedTasks.length > 0
    ? Math.round((urgentTasks.length / filteredAndSortedTasks.length) * 100)
    : 0;

  return (
    <div className='min-h-screen dark:bg-dark-gray py-12 px-6 md:px-12 lg:px-16'>
      <div className='max-w-7xl mx-auto mb-12'>
        <div className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-dark-gray dark:text-white mb-2'>
            {t.title}
          </h1>
          <p className='text-lg text-medium-blue-gray dark:text-gray'>
            {t.subtitle}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8 items-end'>
          <Dropdown
            options={sortOptions.map((key) => t.sortLabels[key])}
            className='text-base'
            label={t.sorting}
            onSelect={(option) => {
              const match = (Object.keys(t.sortLabels) as SortOption[]).find((key) => t.sortLabels[key] === option);
              setSelectedSort(match || 'Name');
            }}
            defaultValue={t.sortLabels[selectedSort]}
            lang={lang as 'ru' | 'en'}
          />
          <Dropdown
            options={filterOptions.map((key) => t.filterLabels[key])}
            className='text-base'
            label={t.filter}
            onSelect={(option) => {
              const match = (Object.keys(t.filterLabels) as FilterOption[]).find((key) => t.filterLabels[key] === option);
              setSelectedFilter(match || 'All');
            }}
            defaultValue={t.filterLabels[selectedFilter]}
            lang={lang as 'ru' | 'en'}
          />
          <InputField
            icon={<span className='material-symbols-outlined'>search</span>}
            placeholder={t.searchPlaceholder}
            className='focus:bg-white'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg border-l-4 border-cyan'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-cyan text-4xl'>assignment</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>{t.allTasksCard}</p>
            <p className='text-5xl font-bold bg-linear-to-r from-cyan to-dark-cyan bg-clip-text text-transparent'>
              {totalCount}
            </p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div className='bg-linear-to-r from-cyan to-dark-cyan h-2 rounded-full' style={{ width: '100%' }} />
            </div>
          </div>

          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg border-l-4 border-light-green'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-light-green text-4xl'>check_circle</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>{t.completedCard}</p>
            <p className='text-5xl font-bold bg-linear-to-r from-light-green to-cyan bg-clip-text text-transparent'>
              {completedCount}
            </p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div
                className='bg-linear-to-r from-light-green to-cyan h-2 rounded-full'
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-lg border-l-4 border-orange'>
            <div className='flex items-center justify-between mb-4'>
              <span className='material-symbols-outlined text-orange text-4xl'>priority_high</span>
            </div>
            <p className='text-medium-blue-gray dark:text-gray text-sm font-medium mb-2'>{t.urgentCard}</p>
            <p className='text-5xl font-bold bg-linear-to-r from-orange to-dark-orange bg-clip-text text-transparent'>
              {urgentTasks.length}
            </p>
            <div className='mt-4 w-full bg-light-blue-gray dark:bg-surface-secondary rounded-full h-2'>
              <div
                className='bg-linear-to-r from-orange to-dark-orange h-2 rounded-full'
                style={{ width: `${urgentPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className='max-w-7xl mx-auto bg-white dark:bg-surface rounded-3xl p-8'>
          <p className='text-lg text-dark-gray dark:text-white'>{t.loading}</p>
        </div>
      )}

      {error && (
        <div className='max-w-7xl mx-auto bg-red-50 border border-red-200 text-red-800 rounded-3xl p-6 mb-8'>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className='max-w-7xl mx-auto mb-12'>
            <div className='bg-linear-to-r from-orange via-light-orange to-yellow rounded-3xl shadow-xl p-8 md:p-10'>
              <div className='flex items-center gap-3 mb-6'>
                <span className='material-symbols-outlined text-white text-3xl'>priority_high</span>
                <h2 className='text-3xl font-bold text-white'>{t.urgentBlock}</h2>
                <span className='ml-auto bg-white text-orange px-4 py-2 rounded-full font-bold text-lg'>
                  {urgentTasks.length}
                </span>
              </div>

              {urgentTasks.length === 0 ? (
                <div className='bg-white/20 rounded-2xl p-6 text-white text-lg'>
                  {t.urgentEmpty}
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {urgentTasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={`urgent-${task.id}`}
                      id={task.id}
                      name={task.name}
                      description={task.description}
                      deadline={task.deadline}
                      status={task.status}
                      lang={lang as 'ru' | 'en'}
                      onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
              <h2 className='text-3xl font-bold text-dark-gray dark:text-white flex items-center gap-3'>
                <span className='material-symbols-outlined text-cyan'>list</span>
                {t.allTasksHeading}
              </h2>
            </div>

            {nonUrgentFilteredTasks.length === 0 ? (
              <div className='bg-white dark:bg-surface rounded-3xl p-8'>
                <p className='text-dark-gray dark:text-white text-lg'>{t.noTasks}</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {nonUrgentFilteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    description={task.description}
                    deadline={task.deadline}
                    status={task.status}
                    lang={lang as 'ru' | 'en'}
                    onStatusChange={(newStatus) => handleTaskStatusChange(task.id, newStatus)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import InputField from '@/components/Input Field';
import AdminTaskItem from '@/components/AdminTaskItem';
import TaskAssignmentModal from '@/components/TaskAssignmentModal';
import TaskReassignmentModal from '@/components/TaskReassignmentModal';
import { useParams } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';

interface Task {
  id: string;
  name: string;
  description: string;
  completion_percent?: number;
  completionPercent?: number;
  status?: string;
}

interface TaskAssignmentFormData {
  name: string;
  description: string;
  deadline: string;
  studentIds: string[];
}

export default function AdminTasksPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'ru';
  const translations = {
    ru: {
      title: 'Все задачи',
      subtitle: (count: number, loading: boolean) => (loading ? 'Загрузка...' : `Всего задач: ${count}`),
      search: 'Поиск по названию...',
      create: '+ Создать новую задачу',
      assignExisting: '➤ Назначить существующую задачу',
      loadingData: 'Загрузка данных...',
      list: 'Список',
      grid: 'Сетка',
      fillAll: 'Заполните все поля',
      updated: 'Задача обновлена!',
      created: 'Задача создана и назначена студентам!',
      assignDone: (n: number) => `Задача назначена ${n} студентам!`,
      errorPrefix: 'Ошибка:',
      empty: 'Задачи не найдены',
      editTitle: 'Редактирование задачи',
      nameLabel: 'Название задачи *',
      descriptionLabel: 'Описание задачи *',
      namePlaceholder: 'Введите название задачи',
      descriptionPlaceholder: 'Введите подробное описание задачи',
      cancel: 'Отмена',
      save: 'Сохранить',
      saving: 'Сохранение...'
    },
    en: {
      title: 'All tasks',
      subtitle: (count: number, loading: boolean) => (loading ? 'Loading...' : `All tasks: ${count}`),
      search: 'Search by name...',
      create: '+ Create a new task',
      assignExisting: '➤ Assign existing task',
      loadingData: 'Loading data...',
      list: 'List',
      grid: 'Grid',
      fillAll: 'Fill in all fields',
      updated: 'Task successfully updated!',
      created: 'Task successfully created and assigned to students!',
      assignDone: (n: number) => `Task assigned to ${n} students!`,
      errorPrefix: 'Error:',
      empty: 'No tasks found',
      editTitle: 'Edit task',
      nameLabel: 'Task name *',
      descriptionLabel: 'Task description *',
      namePlaceholder: 'Enter task name',
      descriptionPlaceholder: 'Enter a detailed task description',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...'
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.ru;
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const buildAuthHeaders = (): Record<string, string> => {
    const token =
      (typeof window !== 'undefined' && localStorage.getItem('jwt')) ||
      (typeof window !== 'undefined' && localStorage.getItem('accessToken')) ||
      (typeof window !== 'undefined' && localStorage.getItem('token'));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/task', {
        headers: {
          ...buildAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error loading: ${response.status}`);
      }

      const data = await response.json();

      const formattedTasks = (Array.isArray(data) ? data : data.results || []).map(
        (task: any, index: number) => ({
          id: task.id?.toString() || (index + 1).toString(),
          name: task.name || task.title || 'Untitled',
          description: task.description || '',
          completionPercent: task.completion_percent || task.completionPercent || 0,
          status: task.status || 'not completed',
        })
      );

      const normalizeCompletionPercent = (analytics: any) => {
        const rawValue =
          analytics?.completed_percent ??
          analytics?.completion_percent ??
          analytics?.completedPercent ??
          analytics?.completionPercent ??
          analytics?.completed;
        const value = Number(rawValue);
        return Number.isFinite(value) ? value : 0;
      };

      const tasksWithCompletion = await Promise.all(
        formattedTasks.map(async (task: Task) => {
          try {
            const analyticsResponse = await fetch(`/api/student_task/analytics/task/${task.id}`, {
              headers: {
                ...buildAuthHeaders(),
              },
            });

            if (!analyticsResponse.ok) {
              throw new Error(`Analytics load failed: ${analyticsResponse.status}`);
            }

            const analyticsData = await analyticsResponse.json();
            const completionPercent = normalizeCompletionPercent(analyticsData);

            return { ...task, completionPercent };
          } catch (analyticsError) {
            console.error('Error loading task analytics:', analyticsError);
            return task;
          }
        })
      );

      setTasks(tasksWithCompletion);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchTasks();
    };
    load();
  }, [fetchTasks]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditModalOpen]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Filtersearch function
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setEditFormData({
        name: task.name,
        description: task.description,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleTaskAssignFromCard = (id: string) => {
    setSelectedTaskForAssign(id);
    setIsReassignModalOpen(true);
  };

  const handleTaskEdit = async () => {
    if (!editingTask || !editFormData.name.trim() || !editFormData.description.trim()) {
      showToast(t.fillAll, 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/task/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
        body: JSON.stringify({
          title: editFormData.name,
          description: editFormData.description,
          id: editingTask.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating task');
      }

      // Update task in local state
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, name: editFormData.name, description: editFormData.description }
          : t
      ));

      setIsEditModalOpen(false);
      setEditingTask(null);
      showToast(t.updated, 'success');
    } catch (err) {
      console.error('Error editing task:', err);
      showToast(err instanceof Error ? err.message : 'Error editing task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskAssignment = async (formData: TaskAssignmentFormData) => {
    try {
      setIsSubmitting(true);

      const deadlineIso = formData.deadline ? new Date(formData.deadline).toISOString() : null;

      // Create task using backend API
      const taskResponse = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
        }),
      });

      if (!taskResponse.ok) {
        throw new Error('Error creating task');
      }

      const taskData = await taskResponse.json();
      const taskId = taskData.id;

      // Assign task to students
      for (const studentId of formData.studentIds) {
        const assignResponse = await fetch('/api/student_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeaders(),
          },
          body: JSON.stringify({
            student_id: parseInt(studentId),
            task_id: taskId,
            deadline: deadlineIso,
            completed: false,
          }),
        });

        if (!assignResponse.ok) {
          throw new Error(`Error when assigning a task to a student ${studentId}`);
        }
      }

      // Refresh tasks list (with updated analytics)
      setIsCreateModalOpen(false);
      await fetchTasks();

      showToast(t.created, 'success');
    } catch (err) {
      console.error('Error when creating and assigning a task:', err);
      showToast(err instanceof Error ? err.message : 'Error creating task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskReassignment = async (
    taskId: string | number,
    studentIds: (string | number)[],
    deadline: string
  ) => {
    try {
      setIsSubmitting(true);

      const deadlineIso = deadline ? new Date(deadline).toISOString() : null;

      // Assign existing task to students
      for (const studentId of studentIds) {
        const assignResponse = await fetch('/api/student_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeaders(),
          },
          body: JSON.stringify({
            student_id: parseInt(studentId.toString()),
            task_id: parseInt(taskId.toString()),
            deadline: deadlineIso,
            completed: false,
          }),
        });

        if (!assignResponse.ok) {
          throw new Error(`Error when assigning a task to a student ${studentId}`);
        }
      }

      // Close modal
      setIsReassignModalOpen(false);
      setSelectedTaskForAssign(null);
      showToast(t.assignDone(studentIds.length), 'success');
    } catch (err) {
      console.error('Error when assigning a task:', err);
      showToast(err instanceof Error ? err.message : 'Error when assigning a task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='px-4 py-8 sm:px-6 md:px-12 lg:px-48'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-extrabold text-dark-gray dark:text-white sm:text-4xl'>
          {t.title}
        </h1>
        <p className='text-medium-blue-gray dark:text-light-blue-gray'>
          {t.subtitle(filteredTasks.length, loading)}
        </p>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-light-orange dark:bg-dark-red text-dark-gray dark:text-white rounded-lg'>
          ⚠️ {t.errorPrefix} {error}
        </div>
      )}

      <div className='mb-6'>
        <InputField
          icon={<MaterialIcon name='search' />}
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='mb-6 flex flex-col gap-3 sm:flex-row'>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className='w-full cursor-pointer rounded-lg bg-dark-cyan px-6 py-2 font-medium text-white transition-colors hover:bg-cyan sm:w-auto'
        >
          {t.create}
        </button>
        <button
          onClick={() => setIsReassignModalOpen(true)}
          className='w-full cursor-pointer rounded-lg bg-orange px-6 py-2 font-medium text-white transition-colors hover:bg-dark-orange sm:w-auto'
        >
          {t.assignExisting}
        </button>
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <p className='text-medium-blue-gray dark:text-light-blue-gray'>{t.loadingData}</p>
        </div>
      ) : (
        <>
          {/* View toggle */}
          <div className='mb-6 flex flex-wrap gap-2'>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-dark-cyan text-white'
                  : 'bg-light-blue-gray dark:bg-surface text-dark-gray dark:text-white'
              } cursor-pointer`}
              aria-pressed={view === 'list'}
              type='button'
            >
              {t.list}
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'grid'
                  ? 'bg-dark-cyan text-white'
                  : 'bg-light-blue-gray dark:bg-surface text-dark-gray dark:text-white'
              } cursor-pointer`}
              aria-pressed={view === 'grid'}
              type='button'
            >
              {t.grid}
            </button>
          </div>

          {view === 'list' ? (
            <div className='flex flex-col gap-3'>
              {filteredTasks.map((task) => (
                <AdminTaskItem
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  description={task.description}
                  completionPercent={task.completionPercent || 0}
                  onEdit={() => handleEditTask(task.id)}
                  onAssign={() => handleTaskAssignFromCard(task.id)}
                  view='list'
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6'>
              {filteredTasks.map((task) => (
                <AdminTaskItem
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  description={task.description}
                  completionPercent={task.completionPercent || 0}
                  onEdit={() => handleEditTask(task.id)}
                  onAssign={() => handleTaskAssignFromCard(task.id)}
                  view='grid'
                  lang={lang}
                />
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && !loading && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <MaterialIcon name='task_alt' className='text-6xl text-light-blue-gray mb-4 block' />
                <p className='text-xl text-medium-blue-gray dark:text-light-blue-gray'>
                  {t.empty}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <TaskAssignmentModal
        isOpen={isCreateModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleTaskAssignment}
        lang={lang}
      />

      <TaskReassignmentModal
        isOpen={isReassignModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsReassignModalOpen(false)}
        onSubmit={handleTaskReassignment}
        preSelectedTaskId={selectedTaskForAssign}
        lang={lang}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingTask && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70'>
          <div className='w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-surface'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-light-blue-gray p-4 dark:border-medium-blue-gray sm:p-6'>
              <h2 className='text-xl font-bold text-dark-gray dark:text-white sm:text-2xl'>
                {t.editTitle}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className='text-medium-blue-gray hover:text-dark-gray dark:text-light-blue-gray dark:hover:text-white text-2xl cursor-pointer'
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className='space-y-6 p-4 sm:p-6'>
              {/* Task Name */}
              <div>
                <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
                  {t.nameLabel}
                </label>
                <input
                  type='text'
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className='w-full px-4 py-2 rounded-lg bg-white dark:bg-surface-secondary text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 focus:ring-dark-cyan'
                  placeholder={t.namePlaceholder}
                />
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
                  {t.descriptionLabel}
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className='w-full px-4 py-2 rounded-lg bg-white dark:bg-surface-secondary text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 focus:ring-dark-cyan'
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-3 border-t border-light-blue-gray pt-4 dark:border-medium-blue-gray sm:flex-row'>
                <button
                  type='button'
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className='flex-1 cursor-pointer rounded-lg border border-light-blue-gray px-4 py-2 font-medium text-dark-gray transition-colors hover:bg-light-blue-gray disabled:opacity-50 dark:border-medium-blue-gray dark:text-light-blue-gray dark:hover:bg-dark-gray'
                >
                  {t.cancel}
                </button>
                <button
                  type='button'
                  onClick={handleTaskEdit}
                  disabled={isSubmitting}
                  className='flex-1 cursor-pointer rounded-lg bg-dark-cyan px-4 py-2 font-medium text-white transition-colors hover:bg-cyan disabled:opacity-50'
                >
                  {isSubmitting ? t.saving : t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

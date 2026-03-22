'use client';

import { useState, useEffect } from 'react';
import InputField from '@/components/Input Field';
import AdminTaskItem from '@/components/AdminTaskItem';
import TaskAssignmentModal from '@/components/TaskAssignmentModal';
import TaskReassignmentModal from '@/components/TaskReassignmentModal';

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/task');
        
        if (!response.ok) {
          throw new Error(`Ошибка при загрузке: ${response.status}`);
        }
        
        const data = await response.json();
        
        const formattedTasks = (Array.isArray(data) ? data : data.results || []).map(
          (task: any, index: number) => ({
            id: task.id?.toString() || (index + 1).toString(),
            name: task.name || task.title || 'Без названия',
            description: task.description || '',
            completionPercent: task.completion_percent || task.completionPercent || 0,
            status: task.status || 'not completed',
          })
        );
        
        setTasks(formattedTasks);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке задач:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Фильтрация по поиску
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
      alert('Заполните все поля');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/task/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editFormData.name,
          description: editFormData.description,
          id: editingTask.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
      }

      // Update task in local state
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, name: editFormData.name, description: editFormData.description }
          : t
      ));

      setIsEditModalOpen(false);
      setEditingTask(null);
      alert('Задача успешно обновлена!');
    } catch (err) {
      console.error('Ошибка при редактировании задачи:', err);
      alert(err instanceof Error ? err.message : 'Ошибка при редактировании задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskAssignment = async (formData: TaskAssignmentFormData) => {
    try {
      setIsSubmitting(true);

      // Create task using backend API
      const taskResponse = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
        }),
      });

      if (!taskResponse.ok) {
        throw new Error('Ошибка при создании задачи');
      }

      const taskData = await taskResponse.json();
      const taskId = taskData.id;

      // Assign task to students
      for (const studentId of formData.studentIds) {
        const assignResponse = await fetch('/api/student_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: parseInt(studentId),
            task_id: taskId,
            completed: false,
          }),
        });

        if (!assignResponse.ok) {
          throw new Error(`Ошибка при назначении задачи студенту ${studentId}`);
        }
      }

      // Refresh tasks list
      setIsCreateModalOpen(false);
      const tasksResponse = await fetch('/api/task');
      if (tasksResponse.ok) {
        const data = await tasksResponse.json();
        const formattedTasks = (Array.isArray(data) ? data : data.results || []).map(
          (task: any, index: number) => ({
            id: task.id?.toString() || (index + 1).toString(),
            name: task.name || task.title || 'Без названия',
            description: task.description || '',
            completionPercent: task.completion_percent || task.completionPercent || 0,
            status: task.status || 'not completed',
          })
        );
        setTasks(formattedTasks);
      }

      alert('Задача успешно создана и назначена студентам!');
    } catch (err) {
      console.error('Ошибка при создании и назначении задачи:', err);
      alert(err instanceof Error ? err.message : 'Ошибка при создании задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskReassignment = async (
    taskId: string | number,
    studentIds: (string | number)[]
  ) => {
    try {
      setIsSubmitting(true);

      // Assign existing task to students
      for (const studentId of studentIds) {
        const assignResponse = await fetch('/api/student_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: parseInt(studentId.toString()),
            task_id: parseInt(taskId.toString()),
            completed: false,
          }),
        });

        if (!assignResponse.ok) {
          throw new Error(`Ошибка при назначении задачи студенту ${studentId}`);
        }
      }

      // Close modal
      setIsReassignModalOpen(false);
      setSelectedTaskForAssign(null);
      alert(`Задача успешно назначена ${studentIds.length} студентам!`);
    } catch (err) {
      console.error('Ошибка при назначении задачи:', err);
      alert(err instanceof Error ? err.message : 'Ошибка при назначении задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='px-6 md:px-12 lg:px-48 py-8'>
      <div className='mb-8'>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Адаптационные задачи
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          {loading ? 'Загрузка...' : `Всего задач: ${filteredTasks.length}`}
        </p>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg'>
          ⚠️ Ошибка: {error}
        </div>
      )}

      <div className='mb-6'>
        <InputField
          icon={<span className='material-symbols-outlined'>search</span>}
          placeholder='Поиск по названию...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='mb-6 flex gap-3'>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors'
        >
          + Создать новую задачу
        </button>
        <button
          onClick={() => setIsReassignModalOpen(true)}
          className='px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors'
        >
          ➤ Назначить существующую задачу
        </button>
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 dark:text-gray-300'>Загрузка данных...</p>
        </div>
      ) : (
        <>
          {/* View toggle */}
          <div className='flex gap-2 mb-6'>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Список
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Сетка
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
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                />
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && !loading && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <span className='material-symbols-outlined text-6xl text-gray-400 mb-4 block'>
                  task_alt
                </span>
                <p className='text-xl text-gray-600 dark:text-gray-400'>
                  Задачи не найдены
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
      />

      <TaskReassignmentModal
        isOpen={isReassignModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsReassignModalOpen(false)}
        onSubmit={handleTaskReassignment}
        preSelectedTaskId={selectedTaskForAssign}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingTask && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Редактировать задачу
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl'
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className='p-6 space-y-6'>
              {/* Task Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Название задачи *
                </label>
                <input
                  type='text'
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Введите название задачи'
                />
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Описание задачи *
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Введите подробное описание задачи'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium'
                >
                  Отмена
                </button>
                <button
                  type='button'
                  onClick={handleTaskEdit}
                  disabled={isSubmitting}
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium'
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

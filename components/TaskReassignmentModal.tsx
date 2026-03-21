'use client';

import { useState, useEffect, useMemo } from 'react';

interface Task {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
}

interface Student {
  id: string | number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  citizenship?: string;
  group?: string;
  gender?: string;
  email: string;
}

type AssignmentType = 'all' | 'citizenship' | 'group' | 'gender';

interface TaskReassignmentModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (taskId: string | number, studentIds: (string | number)[]) => void;
  preSelectedTaskId?: string | null;
}

export default function TaskReassignmentModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  preSelectedTaskId,
}: TaskReassignmentModalProps) {
  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Form states
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | ''>(preSelectedTaskId || '');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  // UI states
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedTaskId(preSelectedTaskId || '');
      setSelectedStudents([]);
      setAssignmentType('all');
      setSelectedFilter('');
    }
  }, [isOpen, preSelectedTaskId]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      setErrors({});

      // Fetch tasks
      const tasksResponse = await fetch('http://159.194.196.47:8000/task');
      let tasksList: Task[] = [];
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        tasksList = Array.isArray(tasksData) ? tasksData : tasksData.results || [];
      }
      setTasks(tasksList);

      // Fetch students
      const studentsResponse = await fetch('/api/student/full_info_list');
      let studentsList: Student[] = [];
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        studentsList = (Array.isArray(studentsData) ? studentsData : studentsData.results || []).map(
          (student: any) => ({
            id: student.id,
            first_name: student.first_name || '',
            last_name: student.last_name || '',
            patronymic: student.patronymic || '',
            citizenship: student.citizenship || '',
            group: student.group || '',
            gender: student.gender || '',
            email: student.email || '',
          })
        );
      }
      setStudents(studentsList);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setErrors({ data: 'Ошибка при загрузке данных' });
    } finally {
      setLoadingData(false);
    }
  };

  // Get unique values for filters
  const uniqueCitizenships = useMemo(
    () => [...new Set(students.map(s => s.citizenship))].filter(Boolean).sort(),
    [students]
  );

  const uniqueGroups = useMemo(
    () => [...new Set(students.map(s => s.group))].filter(Boolean).sort(),
    [students]
  );

  const uniqueGenders = useMemo(
    () => [...new Set(students.map(s => s.gender))].filter(Boolean).sort(),
    [students]
  );

  // Filter students based on assignment type
  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (assignmentType === 'citizenship' && selectedFilter) {
      result = result.filter(s => s.citizenship === selectedFilter);
    } else if (assignmentType === 'group' && selectedFilter) {
      result = result.filter(s => s.group === selectedFilter);
    } else if (assignmentType === 'gender' && selectedFilter) {
      result = result.filter(s => s.gender === selectedFilter);
    }

    return result;
  }, [students, assignmentType, selectedFilter]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedTaskId) {
      newErrors.taskId = 'Выберите задачу';
    }

    if (assignmentType !== 'all' && !selectedFilter) {
      newErrors.filter = 'Выберите фильтр';
    }

    if (selectedStudents.length === 0) {
      newErrors.students = 'Выберите хотя бы одного студента';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(selectedTaskId, selectedStudents);
  };

  const handleAssignmentTypeChange = (type: AssignmentType) => {
    setAssignmentType(type);
    setSelectedFilter('');
    setSelectedStudents([]);
  };

  const toggleStudent = (studentId: string | number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const selectAllFiltered = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Назначить существующую задачу
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl'
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Task Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Выберите задачу *
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                errors.taskId ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
            >
              <option value=''>Выберите задачу...</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name || task.title || `Задача ${task.id}`}
                </option>
              ))}
            </select>
            {errors.taskId && <p className='text-red-500 text-sm mt-1'>{errors.taskId}</p>}
          </div>

          {/* Assignment Type Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Тип назначения *
            </label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              {[
                { value: 'all', label: 'Всем студентам' },
                { value: 'citizenship', label: 'По гражданству' },
                { value: 'group', label: 'По группе' },
                { value: 'gender', label: 'По полу' },
              ].map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleAssignmentTypeChange(option.value as AssignmentType)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assignmentType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Selection */}
          {assignmentType !== 'all' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {assignmentType === 'citizenship' && 'Выберите гражданство'}
                {assignmentType === 'group' && 'Выберите группу'}
                {assignmentType === 'gender' && 'Выберите пол'}
                {' *'}
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setSelectedStudents([]);
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.filter ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              >
                <option value=''>Выберите...</option>
                {assignmentType === 'citizenship' &&
                  uniqueCitizenships.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                {assignmentType === 'group' &&
                  uniqueGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                {assignmentType === 'gender' &&
                  uniqueGenders.map((g) => (
                    <option key={g} value={g}>
                      {g === 'male' ? 'Мужской' : g === 'female' ? 'Женский' : g}
                    </option>
                  ))}
              </select>
              {errors.filter && <p className='text-red-500 text-sm mt-1'>{errors.filter}</p>}
            </div>
          )}

          {/* Students Selection */}
          <div>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Студенты для назначения ({filteredStudents.length})
                {' *'}
              </label>
              <button
                type='button'
                onClick={selectAllFiltered}
                className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
              >
                {selectedStudents.length === filteredStudents.length ? 'Снять все' : 'Выбрать всех'}
              </button>
            </div>

            {errors.students && <p className='text-red-500 text-sm mb-2'>{errors.students}</p>}

            {loadingData ? (
              <div className='text-center py-4'>
                <p className='text-gray-600 dark:text-gray-400'>Загрузка студентов...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-center'>
                <p className='text-gray-600 dark:text-gray-400'>
                  {assignmentType === 'all'
                    ? 'Студенты не найдены'
                    : 'Студенты с выбранным фильтром не найдены'}
                </p>
              </div>
            ) : (
              <div className='border border-gray-300 dark:border-gray-600 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto'>
                {filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className='flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                  >
                    <input
                      type='checkbox'
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className='w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='ml-3 flex-1'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {student.last_name} {student.first_name}
                        {student.patronymic && ` ${student.patronymic}`}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {student.email}
                        {student.citizenship && ` • ${student.citizenship}`}
                        {student.group && ` • ${student.group}`}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedStudents.length > 0 && (
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                Выбрано студентов: {selectedStudents.length}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium'
            >
              Отмена
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium'
            >
              {isLoading ? 'Назначение...' : 'Назначить задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

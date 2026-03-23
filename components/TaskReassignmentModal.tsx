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
  onSubmit: (taskId: string | number, studentIds: (string | number)[], deadline: string) => void;
  preSelectedTaskId?: string | null;
  lang?: string;
}

const copy = {
  en: {
    title: 'Assign existing task',
    selectTask: 'Select task *',
    selectTaskPlaceholder: 'Select task...',
    assignmentTypeLabel: 'Assignment type *',
    assignmentTypeOptions: {
      all: 'All students',
      citizenship: 'By citizenship',
      group: 'By group',
      gender: 'By gender',
    },
    selectCitizenship: 'Select citizenship *',
    selectGroup: 'Select group *',
    selectGender: 'Select gender *',
    selectPlaceholder: 'Select...',
    deadlineLabel: 'Deadline *',
    studentsLabel: (count: number) => `Students for assignment (${count}) *`,
    clearAll: 'Clear all',
    selectAll: 'Select all',
    loading: 'Loading students...',
    studentsNotFound: 'Students not found',
    studentsNotFoundFiltered: 'No students found for selected filter',
    selectedCount: (count: number) => `Selected students: ${count}`,
    cancel: 'Cancel',
    submit: 'Assign task',
    submitting: 'Assigning...',
    errors: {
      task: 'Select task',
      filter: 'Select a filter',
      students: 'Select at least one student',
      deadline: 'Deadline is required',
    },
  },
  ru: {
    title: 'Назначить существующую задачу',
    selectTask: 'Выберите задачу *',
    selectTaskPlaceholder: 'Выберите задачу...',
    assignmentTypeLabel: 'Тип назначения *',
    assignmentTypeOptions: {
      all: 'Всем студентам',
      citizenship: 'По гражданству',
      group: 'По группе',
      gender: 'По полу',
    },
    selectCitizenship: 'Выберите гражданство *',
    selectGroup: 'Выберите группу *',
    selectGender: 'Выберите пол *',
    selectPlaceholder: 'Выберите...',
    deadlineLabel: 'Дедлайн *',
    studentsLabel: (count: number) => `Студенты для назначения (${count}) *`,
    clearAll: 'Сбросить выбор',
    selectAll: 'Выбрать всех',
    loading: 'Загрузка студентов...',
    studentsNotFound: 'Студенты не найдены',
    studentsNotFoundFiltered: 'Нет студентов по выбранному фильтру',
    selectedCount: (count: number) => `Выбрано студентов: ${count}`,
    cancel: 'Отмена',
    submit: 'Назначить задачу',
    submitting: 'Назначение...',
    errors: {
      task: 'Выберите задачу',
      filter: 'Выберите фильтр',
      students: 'Выберите хотя бы одного студента',
      deadline: 'Укажите дедлайн',
    },
  },
};

export default function TaskReassignmentModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  preSelectedTaskId,
  lang = 'ru',
}: TaskReassignmentModalProps) {
  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Form states
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | ''>(preSelectedTaskId || '');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [deadline, setDeadline] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [preAssignedStudents, setPreAssignedStudents] = useState<(string | number)[]>([]);
  const [assignedLoading, setAssignedLoading] = useState(false);

  // UI states
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<(string | number)[]>([]);
  const t = copy[(lang as keyof typeof copy) ?? 'ru'] || copy.ru;

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedTaskId(preSelectedTaskId || '');
      setSelectedStudents([]);
      setPreAssignedStudents([]);
      setAssignmentType('all');
      setSelectedFilter('');
      setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [isOpen, preSelectedTaskId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      setErrors({});

      // Fetch tasks
      const tasksResponse = await fetch('/api/task');
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
      console.error('Error loading data:', err);
      setErrors({ data: t.loading });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchAssignedStudents = async (taskId: string | number) => {
    try {
      setAssignedLoading(true);
      const response = await fetch(`/student_task/task/${taskId}`);
      if (!response.ok) {
        setPreAssignedStudents([]);
        return;
      }

      const data = await response.json();
      const assignedIds = (Array.isArray(data) ? data : data.results || [])
        .map((item: any) => item.student_id || item.studentId || item.student?.id || item.id)
        .filter(Boolean);

      setPreAssignedStudents(assignedIds);
    } catch (err) {
      console.error('Error loading assigned students:', err);
    } finally {
      setAssignedLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !selectedTaskId) {
      setPreAssignedStudents([]);
      return;
    }
    fetchAssignedStudents(selectedTaskId);
  }, [isOpen, selectedTaskId]);

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
      newErrors.taskId = t.errors.task;
    }

    if (!deadline) {
      newErrors.deadline = t.errors.deadline;
    }

    if (assignmentType !== 'all' && !selectedFilter) {
      newErrors.filter = t.errors.filter;
    }

    if (selectedStudents.length === 0) {
      newErrors.students = t.errors.students;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(selectedTaskId, selectedStudents, deadline);
  };

  const handleAssignmentTypeChange = (type: AssignmentType) => {
    setAssignmentType(type);
    setSelectedFilter('');
  };

  const toggleStudent = (studentId: string | number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const hasAll = filteredIds.every((id) => selectedStudents.includes(id));

    if (hasAll) {
      setSelectedStudents((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedStudents((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70'>
      <div className='bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between p-6 border-b border-light-blue-gray dark:border-medium-blue-gray bg-white dark:bg-surface'>
          <h2 className='text-2xl font-bold text-dark-gray dark:text-white'>
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className='text-medium-blue-gray hover:text-dark-gray dark:text-light-blue-gray dark:hover:text-white text-2xl cursor-pointer'
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Task Selection */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
              {t.selectTask}
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white focus:outline-none focus:ring-2 ${
                errors.taskId ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
              }`}
            >
              <option value=''>{t.selectTaskPlaceholder}</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name || task.title || `Task ${task.id}`}
                </option>
              ))}
            </select>
            {errors.taskId && <p className='text-dark-orange text-sm mt-1'>{errors.taskId}</p>}
          </div>

          {/* Assignment Type Selection */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-3'>
              {t.assignmentTypeLabel}
            </label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              {[
                { value: 'all', label: t.assignmentTypeOptions.all },
                { value: 'citizenship', label: t.assignmentTypeOptions.citizenship },
                { value: 'group', label: t.assignmentTypeOptions.group },
                { value: 'gender', label: t.assignmentTypeOptions.gender },
              ].map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleAssignmentTypeChange(option.value as AssignmentType)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assignmentType === option.value
                      ? 'bg-dark-cyan text-white'
                      : 'bg-light-blue-gray dark:bg-medium-blue-gray text-dark-gray dark:text-white hover:bg-cyan/20 dark:hover:bg-dark-cyan/30'
                  } cursor-pointer`}
                  aria-pressed={assignmentType === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
              {t.deadlineLabel}
            </label>
            <input
              type='date'
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white focus:outline-none focus:ring-2 ${
                errors.deadline ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
              }`}
            />
            {errors.deadline && <p className='text-dark-orange text-sm mt-1'>{errors.deadline}</p>}
          </div>

          {/* Filter Selection */}
          {assignmentType !== 'all' && (
            <div>
              <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
                {assignmentType === 'citizenship' && t.selectCitizenship}
                {assignmentType === 'group' && t.selectGroup}
                {assignmentType === 'gender' && t.selectGender}
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white focus:outline-none focus:ring-2 ${
                  errors.filter ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
                }`}
              >
                <option value=''>{t.selectPlaceholder}</option>
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
                      {g === 'male' ? 'Male' : g === 'female' ? 'Female' : g}
                    </option>
                  ))}
              </select>
              {errors.filter && <p className='text-dark-orange text-sm mt-1'>{errors.filter}</p>}
            </div>
          )}

          {/* Students Selection */}
          <div>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray'>
                {t.studentsLabel(filteredStudents.length)}
              </label>
              <button
                type='button'
                onClick={selectAllFiltered}
                className='text-sm text-dark-cyan hover:underline cursor-pointer'
              >
                {selectedStudents.length === filteredStudents.length ? t.clearAll : t.selectAll}
              </button>
            </div>

            {errors.students && <p className='text-dark-orange text-sm mb-2'>{errors.students}</p>}

            {loadingData ? (
              <div className='text-center py-4'>
                <p className='text-medium-blue-gray dark:text-light-blue-gray'>{t.loading}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='bg-light-blue-gray dark:bg-dark-gray/60 p-6 rounded-lg text-center'>
                <p className='text-medium-blue-gray dark:text-light-blue-gray'>
                  {assignmentType === 'all'
                    ? t.studentsNotFound
                    : t.studentsNotFoundFiltered}
                </p>
              </div>
            ) : (
              <div className='border border-light-blue-gray dark:border-medium-blue-gray rounded-lg divide-y divide-light-blue-gray dark:divide-medium-blue-gray max-h-64 overflow-y-auto'>
                {filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className='flex items-center p-3 hover:bg-light-blue-gray dark:hover:bg-dark-gray cursor-pointer transition-colors'
                  >
                    <input
                      type='checkbox'
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className='w-4 h-4 text-dark-cyan border-light-blue-gray dark:border-medium-blue-gray rounded focus:ring-2 focus:ring-dark-cyan cursor-pointer'
                    />
                    <div className='ml-3 flex-1'>
                      <div className='text-sm font-medium text-dark-gray dark:text-white flex items-center gap-2'>
                        {student.last_name} {student.first_name}
                        {student.patronymic && ` ${student.patronymic}`}
                        {preAssignedStudents.includes(student.id) && (
                          <span className='text-xs font-semibold text-dark-cyan'>• уже назначена</span>
                        )}
                      </div>
                      <div className='text-xs text-medium-blue-gray dark:text-light-blue-gray'>
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
              <p className='text-sm text-medium-blue-gray dark:text-light-blue-gray mt-2'>
                {t.selectedCount(selectedStudents.length)}
              </p>
            )}
            {assignedLoading && (
              <p className='text-sm text-medium-blue-gray dark:text-light-blue-gray mt-1'>
                {t.loading}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4 border-t border-light-blue-gray dark:border-medium-blue-gray'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='flex-1 px-4 py-2 border border-light-blue-gray dark:border-medium-blue-gray text-dark-gray dark:text-light-blue-gray rounded-lg hover:bg-light-blue-gray dark:hover:bg-dark-gray transition-colors disabled:opacity-50 font-medium cursor-pointer'
            >
              {t.cancel}
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 px-4 py-2 bg-dark-cyan text-white rounded-lg hover:bg-cyan transition-colors disabled:opacity-50 font-medium cursor-pointer'
            >
              {isLoading ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

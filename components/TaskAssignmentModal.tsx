'use client';

import { useState, useEffect, useMemo } from 'react';
import InputField from '@/components/Input Field';
import Dropdown from '@/components/Dropdown';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  email: string;
  citizenship?: string;
  group?: string;
  gender?: string;
}

interface TaskAssignmentFormData {
  name: string;
  description: string;
  deadline: string;
  studentIds: string[];
}

type AssignmentType = 'all' | 'citizenship' | 'group' | 'gender';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: TaskAssignmentFormData) => void;
  lang?: string;
}

const copy = {
  en: {
    title: 'Create and assign task',
    nameLabel: 'Task name *',
    namePlaceholder: 'Enter task name',
    descriptionLabel: 'Task description *',
    descriptionPlaceholder: 'Enter a detailed task description',
    deadlineLabel: 'Deadline *',
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
    studentsLabel: 'Students for assignment',
    clearAll: 'Clear all',
    selectAll: 'Select all',
    studentsNotFound: 'Students not found',
    studentsNotFoundFiltered: 'No students found for selected filter',
    loadingStudents: 'Loading students...',
    selectedCount: (count: number) => `Selected students: ${count}`,
    cancel: 'Cancel',
    submit: 'Create and assign',
    errors: {
      name: 'Task name is required',
      description: 'Task description is required',
      deadline: 'Deadline is required',
      students: 'Select at least one student',
      filter: 'Select a filter',
    },
    selectLabel: (count: number) => `Students for assignment (${count}) *`,
  },
  ru: {
    title: 'Создать и назначить задачу',
    nameLabel: 'Название задачи *',
    namePlaceholder: 'Введите название задачи',
    descriptionLabel: 'Описание задачи *',
    descriptionPlaceholder: 'Введите подробное описание задачи',
    deadlineLabel: 'Дедлайн *',
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
    studentsLabel: 'Студенты для назначения',
    clearAll: 'Сбросить выбор',
    selectAll: 'Выбрать всех',
    studentsNotFound: 'Студенты не найдены',
    studentsNotFoundFiltered: 'Нет студентов по выбранному фильтру',
    loadingStudents: 'Загрузка студентов...',
    selectedCount: (count: number) => `Выбрано студентов: ${count}`,
    cancel: 'Отмена',
    submit: 'Создать и назначить',
    errors: {
      name: 'Название задачи обязательно',
      description: 'Описание задачи обязательно',
      deadline: 'Укажите дедлайн',
      students: 'Выберите хотя бы одного студента',
      filter: 'Выберите фильтр',
    },
    selectLabel: (count: number) => `Студенты для назначения (${count}) *`,
  },
};

export default function TaskAssignmentModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  lang = 'ru',
}: TaskAssignmentModalProps) {
  const defaultDeadline = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<TaskAssignmentFormData>({
    name: '',
    description: '',
    deadline: defaultDeadline(),
    studentIds: [],
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Assignment type states
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const t = copy[(lang as keyof typeof copy) ?? 'ru'] || copy.ru;

  const resetForm = () => {
    setFormData({ name: '', description: '', deadline: defaultDeadline(), studentIds: [] });
    setSelectedStudents([]);
    setAssignmentType('all');
    setSelectedFilter('');
    setErrors({});
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchStudents();
    } else {
      resetForm();
    }
  }, [isOpen]);

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

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await fetch('/api/student/full_info_list');

      if (!response.ok) {
        throw new Error(t.loadingStudents);
      }

      const data = await response.json();
      const studentList = (Array.isArray(data) ? data : data.results || []).map(
        (student: any, index: number) => ({
          id: student.id?.toString() || (index + 1).toString(),
          first_name: student.first_name || '',
          last_name: student.last_name || '',
          patronymic: student.patronymic || '',
          email: student.email || '',
          citizenship: student.citizenship || '',
          group: student.group || '',
          gender: student.gender || '',
        })
      );

      setStudents(studentList);
    } catch (err) {
      console.error('Error loading students:', err);
      setErrors({ students: t.loadingStudents });
    } finally {
      setLoadingStudents(false);
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

    if (!formData.name.trim()) {
      newErrors.name = t.errors.name;
    }

    if (!formData.description.trim()) {
      newErrors.description = t.errors.description;
    }

    if (!formData.deadline) {
      newErrors.deadline = t.errors.deadline;
    }

    if (selectedStudents.length === 0) {
      newErrors.students = t.errors.students;
    }

    if (assignmentType !== 'all' && !selectedFilter) {
      newErrors.filter = t.errors.filter;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      studentIds: selectedStudents,
    });
  };

  const handleAssignmentTypeChange = (type: AssignmentType) => {
    setAssignmentType(type);
    setSelectedFilter('');
    setSelectedStudents([]);
  };

  const toggleStudent = (studentId: string) => {
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
      <div className='bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
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
          {/* Task Name */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
              {t.nameLabel}
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 ${
                errors.name ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
              }`}
              placeholder={t.namePlaceholder}
            />
            {errors.name && <p className='text-dark-orange text-sm mt-1'>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
              {t.descriptionLabel}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 ${
                errors.description ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
              }`}
              placeholder={t.descriptionPlaceholder}
            />
            {errors.description && <p className='text-dark-orange text-sm mt-1'>{errors.description}</p>}
          </div>

          {/* Deadline */}
          <div>
            <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-2'>
              {t.deadlineLabel}
            </label>
            <input
              type='date'
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white focus:outline-none focus:ring-2 ${
                errors.deadline ? 'border-dark-orange ring-dark-orange' : 'border-light-blue-gray dark:border-medium-blue-gray focus:ring-dark-cyan'
              }`}
            />
            {errors.deadline && <p className='text-dark-orange text-sm mt-1'>{errors.deadline}</p>}
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
                  setSelectedStudents([]);
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
                {t.selectLabel(filteredStudents.length)}
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

            {loadingStudents ? (
              <div className='text-center py-4'>
                <p className='text-medium-blue-gray dark:text-light-blue-gray'>{t.loadingStudents}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='text-center py-4 border border-dashed border-light-blue-gray dark:border-medium-blue-gray rounded-lg'>
                <p className='text-medium-blue-gray dark:text-light-blue-gray'>
                  {assignmentType === 'all'
                    ? t.studentsNotFound
                    : t.studentsNotFoundFiltered}
                </p>
              </div>
            ) : (
              <div className='border border-light-blue-gray dark:border-medium-blue-gray rounded-lg divide-y divide-light-blue-gray dark:divide-medium-blue-gray max-h-48 overflow-y-auto'>
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
                      <div className='text-sm font-medium text-dark-gray dark:text-white'>
                        {student.last_name} {student.first_name}
                        {student.patronymic && ` ${student.patronymic}`}
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
              {isLoading ? `${t.submit}...` : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
}

export default function TaskAssignmentModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}: TaskAssignmentModalProps) {
  const [formData, setFormData] = useState<TaskAssignmentFormData>({
    name: '',
    description: '',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    studentIds: [],
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Assignment type states
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await fetch('/api/student/full_info_list');

      if (!response.ok) {
        throw new Error('Ошибка при загрузке студентов');
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
      console.error('Ошибка при загрузке студентов:', err);
      setErrors({ students: 'Не удалось загрузить студентов' });
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
      newErrors.name = 'Название задачи обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание задачи обязательно';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Дата выполнения обязательна';
    }

    if (selectedStudents.length === 0) {
      newErrors.students = 'Выберите хотя бы одного студента';
    }

    if (assignmentType !== 'all' && !selectedFilter) {
      newErrors.filter = 'Выберите фильтр';
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
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Создать и назначить задачу
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
          {/* Task Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Название задачи *
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder='Введите название задачи'
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Описание задачи *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder='Введите подробное описание задачи'
            />
            {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
          </div>

          {/* Deadline */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Дата выполнения *
            </label>
            <input
              type='date'
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                errors.deadline ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
            />
            {errors.deadline && <p className='text-red-500 text-sm mt-1'>{errors.deadline}</p>}
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
                Студенты для назначения ({filteredStudents.length}) *
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

            {loadingStudents ? (
              <div className='text-center py-4'>
                <p className='text-gray-600 dark:text-gray-400'>Загрузка студентов...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                <p className='text-gray-600 dark:text-gray-400'>
                  {assignmentType === 'all'
                    ? 'Студенты не найдены'
                    : 'Студенты с выбранным фильтром не найдены'}
                </p>
              </div>
            ) : (
              <div className='border border-gray-300 dark:border-gray-600 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-48 overflow-y-auto'>
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
              {isLoading ? 'Создание...' : 'Создать и назначить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

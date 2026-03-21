'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Dropdown from './Dropdown';

import { TaskFormData } from '@/lib/types';

interface TaskModalProps {
  isOpen: boolean;
  isEditMode?: boolean;
  taskData?: TaskFormData;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

// Mock data for selections
const GROUPS = [
  { id: '1', label: 'Группа 1' },
  { id: '2', label: 'Группа 2' },
  { id: '3', label: 'Группа 3' },
  { id: '4', label: 'Группа 4' },
];

const COUNTRIES = [
  { id: 'cn', label: 'Китай' },
  { id: 'vn', label: 'Вьетнам' },
  { id: 'kz', label: 'Казахстан' },
  { id: 'kg', label: 'Киргизия' },
  { id: 'tj', label: 'Таджикистан' },
];

const GENDERS = [
  { id: 'm', label: 'Мужской' },
  { id: 'f', label: 'Женский' },
];

export default function TaskModal({
  isOpen,
  isEditMode = false,
  taskData,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>(
    taskData || {
      name: '',
      description: '',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignmentType: 'all',
      selectedGroups: [],
      selectedCountries: [],
      selectedGenders: [],
    }
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleAssignmentTypeChange = (type: string) => {
    const assignType = type as 'all' | 'group' | 'country' | 'gender';
    setFormData({ 
      ...formData, 
      assignmentType: assignType
    });
    setSelectedItems([]);
  };

  const handleSelectionChange = (item: string) => {
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];

    setSelectedItems(newSelectedItems);

    // Update formData with selected items
    if (formData.assignmentType === 'group') {
      setFormData({ ...formData, selectedGroups: newSelectedItems });
    } else if (formData.assignmentType === 'country') {
      setFormData({ ...formData, selectedCountries: newSelectedItems });
    } else if (formData.assignmentType === 'gender') {
      setFormData({ ...formData, selectedGenders: newSelectedItems });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getSubOptions = () => {
    if (formData.assignmentType === 'group') return GROUPS;
    if (formData.assignmentType === 'country') return COUNTRIES;
    if (formData.assignmentType === 'gender') return GENDERS;
    return [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="w-full max-w-2xl relative rounded-4xl bg-white dark:bg-surface"
        style={{
          backgroundImage: 'url(/modal-bg.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* Content wrapper */}
        <div className="relative p-12 h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-2xl text-dark-gray dark:text-white">
              close
            </span>
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 mt-2">
            {isEditMode ? 'Редактирование задачи' : 'Новая задача'}
          </h2>

          {/* Scrollable fields (before dropdown) */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-4">
            {/* Name field */}
            <div>
              <label className="block text-base font-medium text-black dark:text-white mb-2">
                Название
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Введите название задачи"
                className="w-full px-4 py-3 border border-light-blue-gray rounded-lg text-base focus:outline-none focus:border-orange transition-colors bg-white dark:bg-surface-secondary dark:text-white dark:border-gray text-black"
              />
            </div>

            {/* Description field */}
            <div>
              <label className="block text-base font-medium text-black dark:text-white mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Введите описание задачи"
                rows={4}
                className="w-full px-4 py-3 border border-light-blue-gray rounded-lg text-base focus:outline-none focus:border-orange transition-colors resize-none bg-white dark:bg-surface-secondary dark:text-white dark:border-gray text-black"
              />
            </div>
          </div>

          {/* Assignment section (outside scrollable area to allow dropdown to expand) */}
          <div className="mt-6 relative z-20">
            <label className="block text-base font-medium text-black dark:text-white mb-3">
              Назначение задачи
            </label>

            {/* Assignment type dropdown */}
            <Dropdown
              key={formData.assignmentType}
              options={['Всем студентам', 'По группам', 'По странам', 'По полу']}
              defaultValue={
                formData.assignmentType === 'all' 
                  ? 'Всем студентам'
                  : formData.assignmentType === 'group'
                  ? 'По группам'
                  : formData.assignmentType === 'country'
                  ? 'По странам'
                  : 'По полу'
              }
              onSelect={(option) => {
                const typeMap: Record<string, 'all' | 'group' | 'country' | 'gender'> = {
                  'Всем студентам': 'all',
                  'По группам': 'group',
                  'По странам': 'country',
                  'По полу': 'gender',
                };
                handleAssignmentTypeChange(typeMap[option]);
              }}
              className="w-full"
            />

            {/* Suboptions - shows when type is not 'all' */}
            {formData.assignmentType !== 'all' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  {formData.assignmentType === 'group' && 'Выберите группы:'}
                  {formData.assignmentType === 'country' && 'Выберите страны:'}
                  {formData.assignmentType === 'gender' && 'Выберите пол:'}
                </label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto bg-light-blue-gray dark:bg-surface-secondary rounded-lg p-3">
                  {getSubOptions().map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white dark:hover:bg-surface transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectionChange(item.id)}
                        className="w-4 h-4 cursor-pointer accent-orange"
                      />
                      <span className="text-sm text-black dark:text-white">{item.label}</span>
                    </label>
                  ))}
                </div>
                {selectedItems.length > 0 && (
                  <p className="text-sm text-dark-gray dark:text-white mt-2">
                    Выбрано: {selectedItems.length}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Create button */}
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.description.trim()}
            className="w-full mt-8 px-6 py-4 bg-orange dark:bg-orange text-white text-base font-medium rounded-lg hover:bg-dark-orange dark:hover:bg-dark-orange disabled:bg-gray dark:disabled:bg-gray disabled:cursor-not-allowed transition-colors"
          >
            {isEditMode ? 'Сохранить изменения' : 'Создать задачу'}
          </button>
        </div>
      </div>
    </div>
  );
}

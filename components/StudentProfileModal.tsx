'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import InputField from './Input Field';
import MaterialIcon from '@/components/MaterialIcon';

const translations = {
  ru: {
    title: 'Профиль студента',
    edit: 'Редактировать',
    delete: 'Удалить',
    deleting: 'Удаляем...',
    save: 'Сохранить',
    saving: 'Сохранение...',
    cancel: 'Отмена',
    close: 'Закрыть',
    loading: 'Загрузка данных...',
    errorPrefix: 'Ошибка',
    personalInfo: 'Личные данные',
    labels: {
      lastName: 'Фамилия',
      firstName: 'Имя',
      patronymic: 'Отчество',
      email: 'Email',
      phone: 'Телефон',
      citizenship: 'Гражданство',
      dob: 'Дата рождения',
      address: 'Адрес',
      passport: 'Паспорт',
      snils: 'СНИЛС',
      inn: 'ИНН',
      sfuEmail: 'Почта СФУ',
    },
    tasksTitle: (count: number) => `Назначенные задачи (${count})`,
    noTasks: 'У студента нет назначенных задач',
    deadline: 'Крайний срок',
    completion: 'Прогресс',
    statuses: {
      completed: 'Выполнено',
      'in-progress': 'В процессе',
      'not completed': 'Не выполнено',
    },
  },
  en: {
    title: 'Student profile',
    edit: 'Edit',
    delete: 'Delete',
    deleting: 'Deleting...',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Loading data...',
    errorPrefix: 'Error',
    personalInfo: 'Personal information',
    labels: {
      lastName: 'Last name',
      firstName: 'First name',
      patronymic: 'Middle name',
      email: 'Email',
      phone: 'Phone',
      citizenship: 'Citizenship',
      dob: 'Date of birth',
      address: 'Address',
      passport: 'Passport',
      snils: 'SNILS',
      inn: 'INN',
      sfuEmail: 'SFU email',
    },
    tasksTitle: (count: number) => `Appointed tasks (${count})`,
    noTasks: 'Student has no appointed tasks',
    deadline: 'Deadline',
    completion: 'Progress',
    statuses: {
      completed: 'Completed',
      'in-progress': 'In progress',
      'not completed': 'Not completed',
    },
  },
};

type TaskStatus = 'completed' | 'in-progress' | 'not completed';

interface StudentTask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: TaskStatus;
}

interface StudentProfileData {
  id: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  age: string;
  citizenship: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  passport: string;
  snils?: string;
  inn?: string;
  sfu_email?: string;
  tasks?: StudentTask[];
}

interface StudentProfileModalProps {
  isOpen: boolean;
  studentId?: string;
  onClose: () => void;
  lang?: 'ru' | 'en';
  onDeleted?: (id: string) => void;
  onSaved?: (student: StudentProfileData) => void | Promise<void>;
}

export default function StudentProfileModal({
  isOpen,
  studentId,
  onClose,
  lang = 'ru',
  onDeleted,
  onSaved,
}: StudentProfileModalProps) {
  const t = translations[lang] || translations.ru;
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableStudent, setEditableStudent] = useState<StudentProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const normalizeStatus = (value: unknown): TaskStatus => {
    if (typeof value === 'boolean') {
      return value ? 'completed' : 'not completed';
    }

    if (typeof value !== 'string') {
      return 'not completed';
    }

    const normalized = value.trim().toLowerCase();
    if (normalized === 'completed' || normalized === 'done') {
      return 'completed';
    }
    if (normalized === 'in-progress' || normalized === 'in progress') {
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

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchStudentProfile = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch student info
      const studentResponse = await fetch(`/api/student/${studentId}`);
      if (!studentResponse.ok) {
        throw new Error(t.errorPrefix);
      }

      const student = await studentResponse.json();
      const normalized: StudentProfileData = {
        id: student.id?.toString() || studentId,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        patronymic: student.patronymic || '',
        age: student.age?.toString() || '',
        citizenship: student.citizenship || '',
        email: student.email || '',
        phone_number: student.phone_number || student.phone_rf || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
        passport: student.passport || '',
        snils: student.snils || '',
        inn: student.inn || '',
        sfu_email: student.sfu_email || '',
      };
      setStudentData(normalized);
      setEditableStudent(normalized);

      // Fetch student tasks (two endpoint fallbacks to match backend routing)
      try {
        const endpoints = [
          `/api/student_task/student/${studentId}`,
          `/api//student_task/student/${studentId}`,
        ];

        let tasksRaw: any = null;
        for (const endpoint of endpoints) {
          const response = await fetch(endpoint);
          if (response.ok) {
            tasksRaw = await response.json();
            break;
          }
        }

        const taskList = getResponseList(tasksRaw).map(mapTask);
        setTasks(taskList);
      } catch (err) {
        console.error('Error at loading tasks student:', err);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : t.errorPrefix);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof StudentProfileData, value: string) => {
    if (!editableStudent) return;
    setEditableStudent({ ...editableStudent, [field]: value });
  };

  const handleEditClick = () => {
    setEditableStudent(studentData);
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setEditableStudent(studentData);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!editableStudent || !studentId) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      const payload = {
        first_name: editableStudent.first_name,
        last_name: editableStudent.last_name,
        patronymic: editableStudent.patronymic,
        citizenship: editableStudent.citizenship,
        address: editableStudent.address,
        date_of_birth: editableStudent.date_of_birth,
        passport: editableStudent.passport,
        email: editableStudent.email,
        phone_number: editableStudent.phone_number,
      };

      const response = await fetch(`/api/student/full_patch/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          errorData.message ||
          `Error while saving: ${response.status}`
        );
      }

      setStudentData(editableStudent);
      if (onSaved) {
        await onSaved(editableStudent);
      }
      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error('Error while saving profile:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: t.statuses.completed },
      'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: t.statuses['in-progress'] },
      'not completed': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: t.statuses['not completed'] },
    };

    const config = statusConfig[status] || statusConfig['not completed'];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70'>
      <div className='bg-white dark:bg-dark-gray rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-surface'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{t.title}</h2>
          <div className='flex flex-row justify-center gap-5'>
            <Button
              onClick={async () => {
                if (!studentId) return;
                try {
                  setIsDeleting(true);
                  setDeleteError(null);
                  const resp = await fetch(`/api/student/${studentId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_deleted: true }),
                  });
                  if (!resp.ok) {
                    const errorData = await resp.json().catch(() => ({}));
                    throw new Error(errorData.detail || errorData.message || `Error while deleting: ${resp.status}`);
                  }
                  if (studentId) {
                    onDeleted?.(studentId.toString());
                  }
                  onClose();
                } catch (err) {
                  console.error('Error deleting student:', err);
                  setDeleteError(err instanceof Error ? err.message : t.errorPrefix);
                } finally {
                  setIsDeleting(false);
                }
              }}
              className='bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer'
              icon={<MaterialIcon name='delete' className='text-base' />}
              disabled={isSaving || isDeleting}
            >
              {isDeleting ? t.deleting : t.delete}
            </Button>
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                className='bg-orange text-white hover:bg-dark-orange text-sm cursor-pointer'
                icon={<MaterialIcon name='edit' className='text-base' />}
              >
                {t.edit}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='bg-light-green text-white hover:bg-dark-green text-sm cursor-pointer'
                  icon={<MaterialIcon name='check' className='text-base' />}
                >
                  {isSaving ? t.saving : t.save}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className='bg-light-blue-gray dark:bg-surface-secondary text-white hover:bg-dark-gray text-sm cursor-pointer'
                  icon={<MaterialIcon name='close' className='text-base' />}
                >
                  {t.cancel}
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className='text-gray hover:text-light-blue-gray dark:text-gray-400 dark:hover:text-gray-200 text-2xl cursor-pointer'
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8'>
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-600 dark:text-gray-400'>{t.loading}</p>
            </div>
          ) : error ? (
            <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
              <p className='text-red-600 dark:text-red-400'>⚠️ {error}</p>
            </div>
          ) : studentData ? (
            <div className='space-y-8'>
              {deleteError && (
                <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
                  <p className='text-red-600 dark:text-red-400'>⚠️ {deleteError}</p>
                </div>
              )}
              {saveError && (
                <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
                  <p className='text-red-600 dark:text-red-400'>⚠️ {saveError}</p>
                </div>
              )}

              {/* Student Info */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                  {t.personalInfo}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-surface-secondary p-4 rounded-lg'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.lastName}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.last_name || ''}
                      onChange={(e) => isEditing && handleFieldChange('last_name', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.lastName}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.firstName}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.first_name || ''}
                      onChange={(e) => isEditing && handleFieldChange('first_name', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.firstName}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.patronymic}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.patronymic || ''}
                      onChange={(e) => isEditing && handleFieldChange('patronymic', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.patronymic}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.email}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.email || ''}
                      onChange={(e) => isEditing && handleFieldChange('email', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.email}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.phone}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.phone_number || ''}
                      onChange={(e) => isEditing && handleFieldChange('phone_number', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.phone}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.citizenship}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.citizenship || ''}
                      onChange={(e) => isEditing && handleFieldChange('citizenship', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.citizenship}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.dob}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.date_of_birth || ''}
                      onChange={(e) => isEditing && handleFieldChange('date_of_birth', e.target.value)}
                      readOnly={!isEditing}
                      placeholder='YYYY-MM-DD'
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.address}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.address || ''}
                      onChange={(e) => isEditing && handleFieldChange('address', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.address}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.passport}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.passport || ''}
                      onChange={(e) => isEditing && handleFieldChange('passport', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.passport}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.snils}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.snils || ''}
                      onChange={(e) => isEditing && handleFieldChange('snils', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.snils}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.inn}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.inn || ''}
                      onChange={(e) => isEditing && handleFieldChange('inn', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.inn}
                    />
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{t.labels.sfuEmail}</p>
                    <InputField
                      value={(isEditing ? editableStudent : studentData)?.sfu_email || ''}
                      onChange={(e) => isEditing && handleFieldChange('sfu_email', e.target.value)}
                      readOnly={!isEditing}
                      placeholder={t.labels.sfuEmail}
                    />
                  </div>
                </div>
              </div>

              {/* Tasks Section */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                  {t.tasksTitle(tasks.length)}
                </h3>

                {tasks.length === 0 ? (
                  <div className='bg-gray-50 dark:bg-surface-secondary p-6 rounded-lg text-center'>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t.noTasks}
                    </p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className='bg-gray-50 dark:bg-surface-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors'
                      >
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-gray-900 dark:text-white truncate'>
                              {task.name}
                            </h4>
                            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                              {task.description}
                            </p>

                            <div className='flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400'>
                              <span>
                                📅 {t.deadline}: {task.deadline ? new Date(task.deadline).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US') : '—'}
                              </span>
                            </div>
                          </div>

                          <div className='shrink-0'>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

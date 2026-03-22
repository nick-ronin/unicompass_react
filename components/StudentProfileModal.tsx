'use client';

import { useState, useEffect } from 'react';

interface StudentTask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'not completed';
  completionPercent?: number;
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
  tasks?: StudentTask[];
}

interface StudentProfileModalProps {
  isOpen: boolean;
  studentId?: string;
  onClose: () => void;
}

export default function StudentProfileModal({
  isOpen,
  studentId,
  onClose,
}: StudentProfileModalProps) {
  const [studentData, setStudentData] = useState<StudentProfileData | null>(null);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  const fetchStudentProfile = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch student info
      const studentResponse = await fetch(`/api/student/${studentId}`);
      if (!studentResponse.ok) {
        throw new Error('Error at loading profile student');
      }

      const student = await studentResponse.json();
      setStudentData(student);

      // Fetch student tasks
      try {
        const tasksResponse = await fetch(`/api/student/${studentId}/tasks`);
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          const taskList = Array.isArray(tasksData) ? tasksData : tasksData.results || [];
          setTasks(taskList);
        }
      } catch (err) {
        console.error('Error at loading tasks student:', err);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Completed' },
      'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'In progress' },
      'not completed': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: 'Not completed' },
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
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Profile student</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-600 dark:text-gray-400'>Loading data...</p>
            </div>
          ) : error ? (
            <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
              <p className='text-red-600 dark:text-red-400'>⚠️ {error}</p>
            </div>
          ) : studentData ? (
            <div className='space-y-8'>
              {/* Student Info */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                  Personal information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Full name</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.last_name} {studentData.first_name}
                      {studentData.patronymic && ` ${studentData.patronymic}`}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Email</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.email}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Phone</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.phone_number || '—'}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Age</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.age || '—'}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Citizenship</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.citizenship || '—'}
                    </p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Date of birth</p>
                    <p className='text-base font-medium text-gray-900 dark:text-white'>
                      {studentData.date_of_birth || '—'}
                    </p>
                  </div>

                  {studentData.address && (
                    <div className='md:col-span-2'>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Address</p>
                      <p className='text-base font-medium text-gray-900 dark:text-white'>
                        {studentData.address}
                      </p>
                    </div>
                  )}

                  {studentData.passport && (
                    <div className='md:col-span-2'>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>Passport</p>
                      <p className='text-base font-medium text-gray-900 dark:text-white'>
                        {studentData.passport}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tasks Section */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                  Nominated tasksи ({tasks.length})
                </h3>

                {tasks.length === 0 ? (
                  <div className='bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-center'>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Student more Not appointed tasksи
                    </p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors'
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
                              <span>📅 Extreme term: {new Date(task.deadline).toLocaleDateString('ru-RU')}</span>
                              {task.completionPercent !== undefined && (
                                <span>📊 {task.completionPercent}%</span>
                              )}
                            </div>
                          </div>

                          <div className='flex-shrink-0'>
                            {getStatusBadge(task.status)}
                          </div>
                        </div>

                        {task.completionPercent !== undefined && (
                          <div className='mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                            <div
                              className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                              style={{ width: `${task.completionPercent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

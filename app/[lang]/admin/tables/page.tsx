'use client';

import TableCard from '@/components/TableCard';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const translations = {
  ru: {
    title: 'Управление таблицами',
    subtitle: 'Выберите таблицу для просмотра и редактирования данных',
    tables: {
      students: { title: 'Студенты', description: 'Список студентов и их информация' },
      teachers: { title: 'Преподаватели', description: 'Список преподавателей и их дисциплины' },
      courses: { title: 'Курсы', description: 'Все доступные курсы и программы обучения' },
      enrollments: { title: 'Записи на курсы', description: 'Управление записями студентов на курсы' },
      groups: { title: 'Группы', description: 'Учебные группы и их состав' },
      schedules: { title: 'Расписание', description: 'Расписание занятий и экзаменов' },
    },
  },
  en: {
    title: 'Table management',
    subtitle: 'Choose a table to view and edit data',
    tables: {
      students: { title: 'Students', description: 'List of students and their information' },
      teachers: { title: 'Teachers', description: 'List of teachers and their disciplines' },
      courses: { title: 'Courses', description: 'All available courses and training programs' },
      enrollments: { title: 'Enrollments', description: 'Manage student enrollments in courses' },
      groups: { title: 'Groups', description: 'Study groups and their composition' },
      schedules: { title: 'Schedules', description: 'Class and exam schedules' },
    },
  },
};

export default function AdminTablesPage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[lang as keyof typeof translations] || translations.ru;

  const staticCounts = {
    teachers: 6,
    courses: 8,
    enrollments: 7,
    groups: 7,
    schedules: 7,
  } as const;

  const [studentsCount, setStudentsCount] = useState<number | null>(null);

  const buildAuthHeaders = (): Record<string, string> => {
    const token =
      (typeof window !== 'undefined' && localStorage.getItem('jwt')) ||
      (typeof window !== 'undefined' && localStorage.getItem('accessToken')) ||
      (typeof window !== 'undefined' && localStorage.getItem('token'));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const loadStudentsCount = async () => {
      try {
        const response = await fetch('/api/student/full_info_list', {
          headers: {
            ...buildAuthHeaders(),
          },
        });
        if (!response.ok) throw new Error(`Failed to load students: ${response.status}`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setStudentsCount(list.length);
      } catch (err) {
        console.error('Students count error:', err);
        setStudentsCount(0);
      }
    };

    loadStudentsCount();
  }, []);

  const tables = [
    {
      id: 'students',
      title: t.tables.students.title,
      description: t.tables.students.description,
      icon: '👥',
      count: studentsCount ?? 0,
    },
    {
      id: 'teachers',
      title: t.tables.teachers.title,
      description: t.tables.teachers.description,
      icon: '👨‍🏫',
      count: staticCounts.teachers,
    },
    {
      id: 'courses',
      title: t.tables.courses.title,
      description: t.tables.courses.description,
      icon: '📚',
      count: staticCounts.courses,
    },
    {
      id: 'enrollments',
      title: t.tables.enrollments.title,
      description: t.tables.enrollments.description,
      icon: '📝',
      count: staticCounts.enrollments,
    },
    {
      id: 'groups',
      title: t.tables.groups.title,
      description: t.tables.groups.description,
      icon: '👫',
      count: staticCounts.groups,
    },
    {
      id: 'schedules',
      title: t.tables.schedules.title,
      description: t.tables.schedules.description,
      icon: '📅',
      count: staticCounts.schedules,
    },
  ];

  return (
    <div className='px-4 py-8 sm:px-6 md:px-12 lg:px-48'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-extrabold text-dark-gray dark:text-white sm:text-4xl'>
          {t.title}
        </h1>
        <p className='text-medium-blue-gray dark:text-light-blue-gray'>
          {t.subtitle}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {tables.map((table) => (
          <TableCard
            key={table.id}
            href={`/${lang}/admin/tables/${table.id}`}
            title={table.title}
            description={table.description}
            icon={table.icon}
            count={table.count}
          />
        ))}
      </div>
    </div>
  );
}

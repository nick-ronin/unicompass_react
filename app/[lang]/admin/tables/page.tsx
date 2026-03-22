'use client';

import TableCard from '@/components/TableCard';
import { useParams } from 'next/navigation';

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

  const tables = [
    {
      id: 'students',
      title: t.tables.students.title,
      description: t.tables.students.description,
      icon: '👥',
      count: 234,
    },
    {
      id: 'teachers',
      title: t.tables.teachers.title,
      description: t.tables.teachers.description,
      icon: '👨‍🏫',
      count: 42,
    },
    {
      id: 'courses',
      title: t.tables.courses.title,
      description: t.tables.courses.description,
      icon: '📚',
      count: 18,
    },
    {
      id: 'enrollments',
      title: t.tables.enrollments.title,
      description: t.tables.enrollments.description,
      icon: '📝',
      count: 567,
    },
    {
      id: 'groups',
      title: t.tables.groups.title,
      description: t.tables.groups.description,
      icon: '👫',
      count: 12,
    },
    {
      id: 'schedules',
      title: t.tables.schedules.title,
      description: t.tables.schedules.description,
      icon: '📅',
      count: 156,
    },
  ];

  return (
    <div className='px-6 md:px-12 lg:px-48 py-8'>
      <div className='mb-8'>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          {t.title}
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
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

'use client';

import TableCard from '@/components/TableCard';
import { useParams } from 'next/navigation';

export default function AdminTablesPage() {
  const params = useParams();
  const lang = params.lang as string;

  const tables = [
    {
      id: 'students',
      title: 'Студенты',
      description: 'Список всех студентов и их информация',
      icon: '👥',
      count: 234,
    },
    {
      id: 'teachers',
      title: 'Преподаватели',
      description: 'Список преподавателей и их дисциплины',
      icon: '👨‍🏫',
      count: 42,
    },
    {
      id: 'courses',
      title: 'Курсы',
      description: 'Все доступные курсы и программы обучения',
      icon: '📚',
      count: 18,
    },
    {
      id: 'enrollments',
      title: 'Записи на курсы',
      description: 'Управление записями студентов на курсы',
      icon: '📝',
      count: 567,
    },
    {
      id: 'groups',
      title: 'Группы',
      description: 'Учебные группы и их состав',
      icon: '👫',
      count: 12,
    },
    {
      id: 'schedules',
      title: 'Расписания',
      description: 'Расписание занятий и экзаменов',
      icon: '📅',
      count: 156,
    },
  ];

  return (
    <div className='px-6 md:px-12 lg:px-48 py-8'>
      <div className='mb-8'>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Управление Таблицами
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Выберите таблицу для просмотра и редактирования данных
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

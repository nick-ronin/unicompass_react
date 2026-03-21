'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Schedule {
  id: string;
  day: string;
  time: string;
  course: string;
  group: string;
  room: string;
  teacher: string;
}

const sampleSchedules: Schedule[] = [
  {
    id: '1',
    day: 'Понедельник',
    time: '09:00-10:30',
    course: 'Введение в программирование',
    group: 'МИ-101',
    room: '305',
    teacher: 'Доцент Сидорова М.В.',
  },
  {
    id: '2',
    day: 'Понедельник',
    time: '11:00-12:30',
    course: 'ООП',
    group: 'МИ-102',
    room: '307',
    teacher: 'Доцент Сидорова М.В.',
  },
  {
    id: '3',
    day: 'Вторник',
    time: '08:30-10:00',
    course: 'Базы данных',
    group: 'ПМ-101',
    room: '310',
    teacher: 'Ассистент Иванов А.А.',
  },
  {
    id: '4',
    day: 'Вторник',
    time: '10:30-12:00',
    course: 'Веб-разработка',
    group: 'МИ-201',
    room: '312',
    teacher: 'Профессор Петров И.И.',
  },
  {
    id: '5',
    day: 'Среда',
    time: '09:00-10:30',
    course: 'Компьютерные сети',
    group: 'МИ-301',
    room: '315',
    teacher: 'Доцент Козлов Д.Е.',
  },
  {
    id: '6',
    day: 'Четверг',
    time: '14:00-15:30',
    course: 'Введение в программирование',
    group: 'МИ-102',
    room: '306',
    teacher: 'Профессор Смирнова Е.П.',
  },
];

export default function SchedulesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [schedules] = useState<Schedule[]>(sampleSchedules);

  // Поиск, сортировка и фильтрация
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Получение уникальных значений для фильтров
  const uniqueDays = useMemo(
    () => [...new Set(schedules.map(s => s.day))].sort(),
    [schedules]
  );

  const uniqueRooms = useMemo(
    () => [...new Set(schedules.map(s => s.room))].sort(),
    [schedules]
  );

  // Фильтрованные и отсортированные данные
  const filteredAndSortedData = useMemo(() => {
    let result = [...schedules];

    // Поиск - ищем по курсу, группе и преподавателю
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.course.toLowerCase().includes(query) ||
          s.group.toLowerCase().includes(query) ||
          s.teacher.toLowerCase().includes(query)
      );
    }

    // Фильтрация по дню
    if (filters.day) {
      result = result.filter(s => s.day === filters.day);
    }

    // Фильтрация по аудитории
    if (filters.room) {
      result = result.filter(s => s.room === filters.room);
    }

    // Сортировка
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Schedule] || '';
        const bValue = b[sortColumn as keyof Schedule] || '';

        let comparison = String(aValue).localeCompare(String(bValue), 'ru');
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [schedules, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (schedule: Schedule) => {
    console.log('Edit schedule:', schedule);
  };

  const handleDelete = (schedule: Schedule) => {
    console.log('Delete schedule:', schedule);
  };

  const sortOptions: SortOption[] = [
    { key: 'day', label: 'День' },
    { key: 'time', label: 'Время' },
    { key: 'course', label: 'Курс' },
    { key: 'group', label: 'Группа' },
    { key: 'room', label: 'Аудитория' },
    { key: 'teacher', label: 'Преподаватель' },
  ];

  const filterOptions = [
    {
      name: 'day',
      label: 'День недели',
      options: uniqueDays.map(d => ({ label: d, value: d })),
    },
    {
      name: 'room',
      label: 'Аудитория',
      options: uniqueRooms.map(r => ({ label: r, value: r })),
    },
  ];

  return (
    <div className='px-6 md:px-12 lg:px-48 py-8'>
      <div className='mb-8'>
        <Link
          href={`/${lang}/admin/tables`}
          className='text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block'
        >
          ← Вернуться к таблицам
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Расписания
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Всего записей в расписании: {schedules.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Добавить расписание
        </button>
      </div>

      <TableControls
        searchPlaceholder='Поиск по курсу, группе, преподавателю...'
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onSearch={setSearchQuery}
        onSort={(key, direction) => {
          setSortColumn(key);
          setSortDirection(direction);
        }}
        onFilter={setFilters}
        resultCount={filteredAndSortedData.length}
      />

      <Table<Schedule>
        columns={[
          { key: 'id', label: 'ID', width: '60px', sortable: true },
          { key: 'day', label: 'День', sortable: true },
          { key: 'time', label: 'Время', sortable: true },
          { key: 'course', label: 'Курс', sortable: true },
          { key: 'group', label: 'Группа', sortable: true },
          { key: 'room', label: 'Аудитория', sortable: true },
          { key: 'teacher', label: 'Преподаватель', sortable: true },
        ]}
        data={filteredAndSortedData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(column, direction) => {
          setSortColumn(column);
          setSortDirection(direction);
        }}
      />
    </div>
  );
}

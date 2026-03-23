'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Schedules',
    total: (count: number) => `Total schedule entries: ${count}`,
    addSchedule: '+ Add schedule',
    searchPlaceholder: 'Search by course, group, teacher...',
    filters: 'Filters',
    reset: 'Reset',
    all: 'All',
    resultCount: (count: number) => `Results: ${count}`,
    columns: {
      id: 'ID',
      day: 'Day',
      time: 'Time',
      course: 'Course',
      group: 'Group',
      room: 'Room',
      teacher: 'Teacher',
    },
    filterLabels: {
      day: 'Day of week',
      room: 'Room',
    },
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Расписания',
    total: (count: number) => `Всего записей в расписании: ${count}`,
    addSchedule: '+ Добавить расписание',
    searchPlaceholder: 'Поиск по курсу, группе, преподавателю...',
    filters: 'Фильтры',
    reset: 'Сбросить',
    all: 'Все',
    resultCount: (count: number) => `Найдено: ${count}`,
    columns: {
      id: 'ID',
      day: 'День',
      time: 'Время',
      course: 'Курс',
      group: 'Группа',
      room: 'Аудитория',
      teacher: 'Преподаватель',
    },
    filterLabels: {
      day: 'День недели',
      room: 'Аудитория',
    },
  },
};

interface Schedule {
  id: string;
  day: string;
  time: string;
  course: string;
  group: string;
  room: string;
  teacher: string;
}

const mockSchedules: Schedule[] = [
  {
    id: '1',
    day: 'Monday',
    time: '09:00-10:30',
    course: 'Introduction to Programming',
    group: 'MI-101',
    room: '305',
    teacher: 'Assoc. Prof. Marina Sidorova',
  },
  {
    id: '2',
    day: 'Monday',
    time: '11:00-12:30',
    course: 'Object-Oriented Programming',
    group: 'MI-102',
    room: '307',
    teacher: 'Assoc. Prof. Marina Sidorova',
  },
  {
    id: '3',
    day: 'Tuesday',
    time: '08:30-10:00',
    course: 'Databases',
    group: 'PM-101',
    room: '310',
    teacher: 'Asst. Alex Ivanov',
  },
  {
    id: '4',
    day: 'Tuesday',
    time: '10:30-12:00',
    course: 'Web Development',
    group: 'MI-201',
    room: '312',
    teacher: 'Prof. Irina Petrova',
  },
  {
    id: '5',
    day: 'Wednesday',
    time: '09:00-10:30',
    course: 'Computer Networks',
    group: 'MI-301',
    room: '315',
    teacher: 'Assoc. Prof. Diana Kozlova',
  },
  {
    id: '6',
    day: 'Thursday',
    time: '14:00-15:30',
    course: 'Machine Learning',
    group: 'AI-401',
    room: '306',
    teacher: 'Prof. Irina Petrova',
  },
  {
    id: '7',
    day: 'Friday',
    time: '12:00-13:30',
    course: 'Software Testing',
    group: 'MI-301',
    room: '210',
    teacher: 'Asst. Pavel Smirnov',
  },
];

export default function SchedulesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [schedules] = useState<Schedule[]>(mockSchedules);

  // Search, sort and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Getting unique values ​​for filters
  const uniqueDays = useMemo(
    () => [...new Set(schedules.map(s => s.day))].sort(),
    [schedules]
  );

  const uniqueRooms = useMemo(
    () => [...new Set(schedules.map(s => s.room))].sort(),
    [schedules]
  );

  // Filtered and sorted data (students page style)
  const filteredAndSortedData = useMemo(() => {
    let result = [...schedules];

    // Search - search by course, group and teacher
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.course.toLowerCase().includes(query) ||
          s.group.toLowerCase().includes(query) ||
          s.teacher.toLowerCase().includes(query)
      );
    }

    // Filter by day
    if (filters.day) {
      result = result.filter(s => s.day === filters.day);
    }

    // Filter by room
    if (filters.room) {
      result = result.filter(s => s.room === filters.room);
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Schedule] || '';
        const bValue = b[sortColumn as keyof Schedule] || '';

        let comparison = String(aValue).localeCompare(String(bValue), lang === 'ru' ? 'ru' : 'en');
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
    { key: 'day', label: t.columns.day },
    { key: 'time', label: t.columns.time },
    { key: 'course', label: t.columns.course },
    { key: 'group', label: t.columns.group },
    { key: 'room', label: t.columns.room },
    { key: 'teacher', label: t.columns.teacher },
  ];

  const filterOptions = [
    {
      name: 'day',
      label: t.filterLabels.day,
      options: uniqueDays.map(d => ({ label: d, value: d })),
    },
    {
      name: 'room',
      label: t.filterLabels.room,
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
          {t.backToTables}
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          {t.title}
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          {t.total(schedules.length)}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-cyan hover:bg-cyan/80 dark:bg-dark-cyan dark:hover:bg-dark-cyan/80 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          {t.addSchedule}
        </button>
      </div>

      <TableControls
        searchPlaceholder={t.searchPlaceholder}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onSearch={setSearchQuery}
        onSort={(key, direction) => {
          setSortColumn(key);
          setSortDirection(direction);
        }}
        onFilter={setFilters}
        resultCount={filteredAndSortedData.length}
        labels={{
          filters: t.filters,
          reset: t.reset,
          found: t.resultCount,
          all: t.all,
        }}
      />

      <Table<Schedule>
        columns={[
          { key: 'id', label: t.columns.id, width: '60px', sortable: true },
          { key: 'day', label: t.columns.day, sortable: true },
          { key: 'time', label: t.columns.time, sortable: true },
          { key: 'course', label: t.columns.course, sortable: true },
          { key: 'group', label: t.columns.group, sortable: true },
          { key: 'room', label: t.columns.room, sortable: true },
          { key: 'teacher', label: t.columns.teacher, sortable: true },
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

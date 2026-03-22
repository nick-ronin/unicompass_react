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
    day: 'Monday',
    time: '09:00-10:30',
    course: 'Introduction to Programming',
    group: 'MI-101',
    room: '305',
    teacher: 'Associate Professor Sidorova M.V..',
  },
  {
    id: '2',
    day: 'Monday',
    time: '11:00-12:30',
    course: 'OOP',
    group: 'MI-102',
    room: '307',
    teacher: 'Associate Professor Sidorova M.V..',
  },
  {
    id: '3',
    day: 'Tuesday',
    time: '08:30-10:00',
    course: 'Databases',
    group: 'PM-101',
    room: '310',
    teacher: 'Assistant Ivanov A.A..',
  },
  {
    id: '4',
    day: 'Tuesday',
    time: '10:30-12:00',
    course: 'Web development',
    group: 'MI-201',
    room: '312',
    teacher: 'Professor Petrov I.I..',
  },
  {
    id: '5',
    day: 'Wednesday',
    time: '09:00-10:30',
    course: 'Computer networks',
    group: 'MI-301',
    room: '315',
    teacher: 'Associate Professor Kozlov D.E..',
  },
  {
    id: '6',
    day: 'Thursday',
    time: '14:00-15:30',
    course: 'Introduction to Programming',
    group: 'MI-102',
    room: '306',
    teacher: 'Professor Smirnova E.P..',
  },
];

export default function SchedulesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [schedules] = useState<Schedule[]>(sampleSchedules);

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

  // Filtercurated and sorted data
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

    // Filteration by day
    if (filters.day) {
      result = result.filter(s => s.day === filters.day);
    }

    // Filteration by audience
    if (filters.room) {
      result = result.filter(s => s.room === filters.room);
    }

    // Sorting
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
    { key: 'day', label: 'Day' },
    { key: 'time', label: 'Time' },
    { key: 'course', label: 'Well' },
    { key: 'group', label: 'Group' },
    { key: 'room', label: 'Audience' },
    { key: 'teacher', label: 'Teacher' },
  ];

  const filterOptions = [
    {
      name: 'day',
      label: 'Day weeks',
      options: uniqueDays.map(d => ({ label: d, value: d })),
    },
    {
      name: 'room',
      label: 'Audience',
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
          ← Return to tables
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Schedules
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Allth entries in the schedule: {schedules.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Add schedule
        </button>
      </div>

      <TableControls
        searchPlaceholder='Search by course, group, teacher...'
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
          { key: 'day', label: 'Day', sortable: true },
          { key: 'time', label: 'Time', sortable: true },
          { key: 'course', label: 'Well', sortable: true },
          { key: 'group', label: 'Group', sortable: true },
          { key: 'room', label: 'Audience', sortable: true },
          { key: 'teacher', label: 'Teacher', sortable: true },
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

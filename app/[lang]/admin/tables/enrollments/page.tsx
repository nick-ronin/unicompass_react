'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Course enrollments',
    total: (count: number) => `Total enrollments: ${count}`,
    addEntry: '+ Add enrollment',
    searchPlaceholder: 'Search by student or course...',
    filters: 'Filters',
    reset: 'Reset',
    all: 'All',
    resultCount: (count: number) => `Results: ${count}`,
    columns: {
      id: 'ID',
      student: 'Student',
      course: 'Course',
      grade: 'Grade',
      enrollmentDate: 'Enrollment date',
      status: 'Status',
    },
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Записи на курсы',
    total: (count: number) => `Всего записей: ${count}`,
    addEntry: '+ Добавить запись',
    searchPlaceholder: 'Поиск по студенту или курсу...',
    filters: 'Фильтры',
    reset: 'Сбросить',
    all: 'Все',
    resultCount: (count: number) => `Найдено: ${count}`,
    columns: {
      id: 'ID',
      student: 'Студент',
      course: 'Курс',
      grade: 'Оценка',
      enrollmentDate: 'Дата записи',
      status: 'Статус',
    },
  },
};

interface Enrollment {
  id: string;
  student: string;
  course: string;
  grade: string;
  enrollmentDate: string;
  status: string;
}

const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    student: 'Иван Петров',
    course: 'Введение в программирование',
    grade: 'A',
    enrollmentDate: '2024-09-01',
    status: 'Завершена',
  },
  {
    id: '2',
    student: 'Мария Сидорова',
    course: 'Введение в программирование',
    grade: 'B+',
    enrollmentDate: '2024-09-01',
    status: 'Завершена',
  },
  {
    id: '3',
    student: 'Алексей Иванов',
    course: 'ООП',
    grade: '-',
    enrollmentDate: '2024-09-15',
    status: 'В процессе',
  },
  {
    id: '4',
    student: 'Елена Смирнова',
    course: 'Веб-разработка',
    grade: 'A-',
    enrollmentDate: '2024-09-20',
    status: 'В процессе',
  },
  {
    id: '5',
    student: 'Дмитрий Козлов',
    course: 'Базы данных',
    grade: '-',
    enrollmentDate: '2024-10-01',
    status: 'Запланирована',
  },
  {
    id: '6',
    student: 'Светлана Орлова',
    course: 'Компьютерные сети',
    grade: '-',
    enrollmentDate: '2024-10-05',
    status: 'В процессе',
  },
  {
    id: '7',
    student: 'Юрий Антонов',
    course: 'Машинное обучение',
    grade: '-',
    enrollmentDate: '2024-10-12',
    status: 'Запланирована',
  },
];

export default function EnrollmentsTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);

  // Search, sort and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Getting unique values ​​for filters
  const uniqueGrades = useMemo(
    () => [...new Set(enrollments.map(e => e.grade))].sort(),
    [enrollments]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(enrollments.map(e => e.status))].sort(),
    [enrollments]
  );

  // Filtered and sorted data (students page style)
  const filteredAndSortedData = useMemo(() => {
    let result = [...enrollments];

    // Search - search by student and course
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        e =>
          e.student.toLowerCase().includes(query) ||
          e.course.toLowerCase().includes(query)
      );
    }

    // Filter by grade
    if (filters.grade) {
      result = result.filter(e => e.grade === filters.grade);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter(e => e.status === filters.status);
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Enrollment] || '';
        const bValue = b[sortColumn as keyof Enrollment] || '';

        let comparison = String(aValue).localeCompare(String(bValue), lang === 'ru' ? 'ru' : 'en');
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [enrollments, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (enrollment: Enrollment) => {
    console.log('Edit enrollment:', enrollment);
  };

  const handleDelete = (enrollment: Enrollment) => {
    console.log('Delete enrollment:', enrollment);
  };

  const sortOptions: SortOption[] = [
    { key: 'student', label: t.columns.student },
    { key: 'course', label: t.columns.course },
    { key: 'grade', label: t.columns.grade },
    { key: 'enrollmentDate', label: t.columns.enrollmentDate },
    { key: 'status', label: t.columns.status },
  ];

  const filterOptions = [
    {
      name: 'grade',
      label: t.columns.grade,
      options: uniqueGrades.map(g => ({ label: g, value: g })),
    },
    {
      name: 'status',
      label: t.columns.status,
      options: uniqueStatuses.map(s => ({ label: s, value: s })),
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
          {t.total(enrollments.length)}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-cyan hover:bg-cyan/80 dark:bg-dark-cyan dark:hover:bg-dark-cyan/80 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          {t.addEntry}
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

      <Table<Enrollment>
        columns={[
          { key: 'id', label: t.columns.id, width: '60px', sortable: true },
          { key: 'student', label: t.columns.student, sortable: true },
          { key: 'course', label: t.columns.course, sortable: true },
          { key: 'grade', label: t.columns.grade, sortable: true },
          { key: 'enrollmentDate', label: t.columns.enrollmentDate, sortable: true },
          { key: 'status', label: t.columns.status, sortable: true },
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

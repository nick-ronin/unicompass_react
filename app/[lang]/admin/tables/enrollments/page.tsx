'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Enrollment {
  id: string;
  student: string;
  course: string;
  grade: string;
  enrollmentDate: string;
  status: string;
}

const sampleEnrollments: Enrollment[] = [
  {
    id: '1',
    student: 'Иван Петров',
    course: 'Введение в программирование',
    grade: 'A',
    enrollmentDate: '2024-09-01',
    status: 'Завершено',
  },
  {
    id: '2',
    student: 'Мария Сидорова',
    course: 'Введение в программирование',
    grade: 'B+',
    enrollmentDate: '2024-09-01',
    status: 'Завершено',
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
    status: 'Ожидание',
  },
];

export default function EnrollmentsTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [enrollments] = useState<Enrollment[]>(sampleEnrollments);

  // Поиск, сортировка и фильтрация
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Получение уникальных значений для фильтров
  const uniqueGrades = useMemo(
    () => [...new Set(enrollments.map(e => e.grade))].sort(),
    [enrollments]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(enrollments.map(e => e.status))].sort(),
    [enrollments]
  );

  // Фильтрованные и отсортированные данные
  const filteredAndSortedData = useMemo(() => {
    let result = [...enrollments];

    // Поиск - ищем по студенту и курсу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        e =>
          e.student.toLowerCase().includes(query) ||
          e.course.toLowerCase().includes(query)
      );
    }

    // Фильтрация по оценке
    if (filters.grade) {
      result = result.filter(e => e.grade === filters.grade);
    }

    // Фильтрация по статусу
    if (filters.status) {
      result = result.filter(e => e.status === filters.status);
    }

    // Сортировка
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Enrollment] || '';
        const bValue = b[sortColumn as keyof Enrollment] || '';

        let comparison = String(aValue).localeCompare(String(bValue), 'ru');
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
    { key: 'student', label: 'Студент' },
    { key: 'course', label: 'Курс' },
    { key: 'grade', label: 'Оценка' },
    { key: 'enrollmentDate', label: 'Дата записи' },
    { key: 'status', label: 'Статус' },
  ];

  const filterOptions = [
    {
      name: 'grade',
      label: 'Оценка',
      options: uniqueGrades.map(g => ({ label: g, value: g })),
    },
    {
      name: 'status',
      label: 'Статус',
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
          ← Вернуться к таблицам
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Записи на курсы
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Всего записей: {enrollments.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Добавить запись
        </button>
      </div>

      <TableControls
        searchPlaceholder='Поиск по студенту или курсу...'
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

      <Table<Enrollment>
        columns={[
          { key: 'id', label: 'ID', width: '60px', sortable: true },
          { key: 'student', label: 'Студент', sortable: true },
          { key: 'course', label: 'Курс', sortable: true },
          { key: 'grade', label: 'Оценка', sortable: true },
          { key: 'enrollmentDate', label: 'Дата записи', sortable: true },
          { key: 'status', label: 'Статус', sortable: true },
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

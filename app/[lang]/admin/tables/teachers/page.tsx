'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Teachers',
    total: (count: number) => `Total teachers: ${count}`,
    addTeacher: '+ Add teacher',
    searchPlaceholder: 'Search by name, email, subjects...',
    filters: 'Filters',
    reset: 'Reset',
    all: 'All',
    resultCount: (count: number) => `Results: ${count}`,
    columns: {
      id: 'ID',
      name: 'Name',
      email: 'Email',
      department: 'Department',
      subjects: 'Subjects',
      status: 'Status',
    },
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Преподаватели',
    total: (count: number) => `Всего преподавателей: ${count}`,
    addTeacher: '+ Добавить преподавателя',
    searchPlaceholder: 'Поиск по имени, email, дисциплинам...',
    filters: 'Фильтры',
    reset: 'Сбросить',
    all: 'Все',
    resultCount: (count: number) => `Найдено: ${count}`,
    columns: {
      id: 'ID',
      name: 'Имя',
      email: 'Email',
      department: 'Кафедра',
      subjects: 'Дисциплины',
      status: 'Статус',
    },
  },
};

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string;
  status: string;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Проф. Иван Петров',
    email: 'petrov@example.com',
    department: 'Математика',
    subjects: 'Алгебра, Геометрия',
    status: 'Активен',
  },
  {
    id: '2',
    name: 'Доцент Марина Сидорова',
    email: 'sidorova@example.com',
    department: 'Информатика',
    subjects: 'ООП, Базы данных',
    status: 'Активен',
  },
  {
    id: '3',
    name: 'Ассистент Алексей Иванов',
    email: 'ivanov@example.com',
    department: 'Физика',
    subjects: 'Механика, Термодинамика',
    status: 'Активен',
  },
  {
    id: '4',
    name: 'Проф. Елена Смирнова',
    email: 'smirnova@example.com',
    department: 'Литература',
    subjects: 'Русская литература',
    status: 'В отпуске',
  },
  {
    id: '5',
    name: 'Доцент Диана Козлова',
    email: 'kozlova@example.com',
    department: 'Информатика',
    subjects: 'Сети, Безопасность',
    status: 'Активен',
  },
  {
    id: '6',
    name: 'Преп. Анна Романова',
    email: 'romanova@example.com',
    department: 'Дизайн',
    subjects: 'UI/UX, Визуальный дизайн',
    status: 'Активен',
  },
];

export default function TeachersTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [teachers] = useState<Teacher[]>(mockTeachers);

  // Search, sorting, filters (students page style)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Unique values for filters
  const uniqueDepartments = useMemo(
    () => [...new Set(teachers.map(t => t.department))].sort(),
    [teachers]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(teachers.map(t => t.status))].sort(),
    [teachers]
  );

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let result = [...teachers];

    // Search by name, email, subjects
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.subjects.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (filters.department) {
      result = result.filter(t => t.department === filters.department);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Teacher] || '';
        const bValue = b[sortColumn as keyof Teacher] || '';

        let comparison = String(aValue).localeCompare(String(bValue), lang === 'ru' ? 'ru' : 'en');
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [teachers, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (teacher: Teacher) => {
    console.log('Edit teacher:', teacher);
  };

  const handleDelete = (teacher: Teacher) => {
    console.log('Delete teacher:', teacher);
  };

  const sortOptions: SortOption[] = [
    { key: 'name', label: t.columns.name },
    { key: 'department', label: t.columns.department },
    { key: 'email', label: t.columns.email },
    { key: 'status', label: t.columns.status },
  ];

  const filterOptions = [
    {
      name: 'department',
      label: t.columns.department,
      options: uniqueDepartments.map(d => ({ label: d, value: d })),
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
          {t.total(teachers.length)}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          {t.addTeacher}
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

      <Table<Teacher>
        columns={[
          { key: 'id', label: t.columns.id, width: '60px', sortable: true },
          { key: 'name', label: t.columns.name, sortable: true },
          { key: 'email', label: t.columns.email, sortable: true },
          { key: 'department', label: t.columns.department, sortable: true },
          { key: 'subjects', label: t.columns.subjects },
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

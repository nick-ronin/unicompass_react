'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string;
  status: string;
}

const sampleTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Профессор Петров И.И.',
    email: 'prof.petrov@example.com',
    department: 'Математика',
    subjects: 'Алгебра, Геометрия',
    status: 'Активен',
  },
  {
    id: '2',
    name: 'Доцент Сидорова М.В.',
    email: 'doc.sidorova@example.com',
    department: 'Информатика',
    subjects: 'ООП, Базы данных',
    status: 'Активен',
  },
  {
    id: '3',
    name: 'Ассистент Иванов А.А.',
    email: 'assist.ivanov@example.com',
    department: 'Физика',
    subjects: 'Механика, Термодинамика',
    status: 'Активен',
  },
  {
    id: '4',
    name: 'Профессор Смирнова Е.П.',
    email: 'prof.smirnova@example.com',
    department: 'Литература',
    subjects: 'Русская литература',
    status: 'В отпуске',
  },
  {
    id: '5',
    name: 'Доцент Козлов Д.Е.',
    email: 'doc.kozlov@example.com',
    department: 'История',
    subjects: 'Всемирная история, История России',
    status: 'Активен',
  },
];

export default function TeachersTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [teachers] = useState<Teacher[]>(sampleTeachers);

  // Поиск, сортировка и фильтрация
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Получение уникальных значений для фильтров
  const uniqueDepartments = useMemo(
    () => [...new Set(teachers.map(t => t.department))].sort(),
    [teachers]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(teachers.map(t => t.status))].sort(),
    [teachers]
  );

  // Фильтрованные и отсортированные данные
  const filteredAndSortedData = useMemo(() => {
    let result = [...teachers];

    // Поиск - ищем по имени, email и дисциплинам
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.subjects.toLowerCase().includes(query)
      );
    }

    // Фильтрация по кафедре
    if (filters.department) {
      result = result.filter(t => t.department === filters.department);
    }

    // Фильтрация по статусу
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Сортировка
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Teacher] || '';
        const bValue = b[sortColumn as keyof Teacher] || '';

        let comparison = String(aValue).localeCompare(String(bValue), 'ru');
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
    { key: 'name', label: 'Имя' },
    { key: 'department', label: 'Кафедра' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Статус' },
  ];

  const filterOptions = [
    {
      name: 'department',
      label: 'Кафедра',
      options: uniqueDepartments.map(d => ({ label: d, value: d })),
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
          Преподаватели
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Всего преподавателей: {teachers.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Добавить преподавателя
        </button>
      </div>

      <TableControls
        searchPlaceholder='Поиск по имени, email, дисциплинам...'
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

      <Table<Teacher>
        columns={[
          { key: 'id', label: 'ID', width: '60px', sortable: true },
          { key: 'name', label: 'Имя', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'department', label: 'Кафедра', sortable: true },
          { key: 'subjects', label: 'Дисциплины' },
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

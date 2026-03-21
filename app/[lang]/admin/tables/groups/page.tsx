'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Group {
  id: string;
  name: string;
  specialization: string;
  year: string;
  students: string;
  curator: string;
  status: string;
}

const sampleGroups: Group[] = [
  {
    id: '1',
    name: 'МИ-101',
    specialization: 'Информатика',
    year: '1',
    students: '25',
    curator: 'Профессор Петров И.И.',
    status: 'Активна',
  },
  {
    id: '2',
    name: 'МИ-102',
    specialization: 'Информатика',
    year: '1',
    students: '22',
    curator: 'Доцент Сидорова М.В.',
    status: 'Активна',
  },
  {
    id: '3',
    name: 'ПМ-101',
    specialization: 'Прикладная математика',
    year: '1',
    students: '20',
    curator: 'Ассистент Иванов А.А.',
    status: 'Активна',
  },
  {
    id: '4',
    name: 'МИ-201',
    specialization: 'Информатика',
    year: '2',
    students: '23',
    curator: 'Профессор Смирнова Е.П.',
    status: 'Активна',
  },
  {
    id: '5',
    name: 'МИ-301',
    specialization: 'Информатика',
    year: '3',
    students: '18',
    curator: 'Доцент Козлов Д.Е.',
    status: 'Активна',
  },
];

export default function GroupsTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [groups] = useState<Group[]>(sampleGroups);

  // Поиск, сортировка и фильтрация
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Получение уникальных значений для фильтров
  const uniqueSpecializations = useMemo(
    () => [...new Set(groups.map(g => g.specialization))].sort(),
    [groups]
  );

  const uniqueYears = useMemo(
    () => [...new Set(groups.map(g => g.year))].sort((a, b) => Number(a) - Number(b)),
    [groups]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(groups.map(g => g.status))].sort(),
    [groups]
  );

  // Фильтрованные и отсортированные данные
  const filteredAndSortedData = useMemo(() => {
    let result = [...groups];

    // Поиск - ищем по названию, специализации и куратору
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(query) ||
          g.specialization.toLowerCase().includes(query) ||
          g.curator.toLowerCase().includes(query)
      );
    }

    // Фильтрация по специализации
    if (filters.specialization) {
      result = result.filter(g => g.specialization === filters.specialization);
    }

    // Фильтрация по курсу
    if (filters.year) {
      result = result.filter(g => g.year === filters.year);
    }

    // Фильтрация по статусу
    if (filters.status) {
      result = result.filter(g => g.status === filters.status);
    }

    // Сортировка
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Group] || '';
        const bValue = b[sortColumn as keyof Group] || '';

        let comparison = 0;
        if (sortColumn === 'year' || sortColumn === 'students') {
          comparison = Number(aValue) - Number(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue), 'ru');
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [groups, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (group: Group) => {
    console.log('Edit group:', group);
  };

  const handleDelete = (group: Group) => {
    console.log('Delete group:', group);
  };

  const sortOptions: SortOption[] = [
    { key: 'name', label: 'Название' },
    { key: 'specialization', label: 'Специализация' },
    { key: 'year', label: 'Курс' },
    { key: 'students', label: 'Студентов' },
    { key: 'curator', label: 'Куратор' },
    { key: 'status', label: 'Статус' },
  ];

  const filterOptions = [
    {
      name: 'specialization',
      label: 'Специализация',
      options: uniqueSpecializations.map(s => ({ label: s, value: s })),
    },
    {
      name: 'year',
      label: 'Курс',
      options: uniqueYears.map(y => ({ label: y, value: y })),
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
          Группы
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Всего групп: {groups.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Добавить группу
        </button>
      </div>

      <TableControls
        searchPlaceholder='Поиск по названию, специализации, куратору...'
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

      <Table<Group>
        columns={[
          { key: 'id', label: 'ID', width: '60px', sortable: true },
          { key: 'name', label: 'Название', sortable: true },
          { key: 'specialization', label: 'Специализация', sortable: true },
          { key: 'year', label: 'Курс', sortable: true },
          { key: 'students', label: 'Студентов', sortable: true },
          { key: 'curator', label: 'Куратор', sortable: true },
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

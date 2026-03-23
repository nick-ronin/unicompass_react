'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Groups',
    total: (count: number) => `Total groups: ${count}`,
    addGroup: '+ Add group',
    searchPlaceholder: 'Search by name, specialization, curator...',
    filters: 'Filters',
    reset: 'Reset',
    all: 'All',
    resultCount: (count: number) => `Results: ${count}`,
    columns: {
      id: 'ID',
      name: 'Name',
      specialization: 'Specialization',
      year: 'Year',
      students: 'Students',
      curator: 'Curator',
      status: 'Status',
    },
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Группы',
    total: (count: number) => `Всего групп: ${count}`,
    addGroup: '+ Добавить группу',
    searchPlaceholder: 'Поиск по названию, специализации, куратору...',
    filters: 'Фильтры',
    reset: 'Сбросить',
    all: 'Все',
    resultCount: (count: number) => `Найдено: ${count}`,
    columns: {
      id: 'ID',
      name: 'Название',
      specialization: 'Специализация',
      year: 'Курс',
      students: 'Студентов',
      curator: 'Куратор',
      status: 'Статус',
    },
  },
};

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
    name: 'MI-101',
    specialization: 'Informatics',
    year: '1',
    students: '25',
    curator: 'Professor Petrov I.I..',
    status: 'Active',
  },
  {
    id: '2',
    name: 'MI-102',
    specialization: 'Informatics',
    year: '1',
    students: '22',
    curator: 'Associate Professor Sidorova M.V..',
    status: 'Active',
  },
  {
    id: '3',
    name: 'PM-101',
    specialization: 'Applied Mathematics',
    year: '1',
    students: '20',
    curator: 'Assistant Ivanov A.A..',
    status: 'Active',
  },
  {
    id: '4',
    name: 'MI-201',
    specialization: 'Informatics',
    year: '2',
    students: '23',
    curator: 'Professor Smirnova E.P..',
    status: 'Active',
  },
  {
    id: '5',
    name: 'MI-301',
    specialization: 'Informatics',
    year: '3',
    students: '18',
    curator: 'Associate Professor Kozlov D.E..',
    status: 'Active',
  },
];

export default function GroupsTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [groups] = useState<Group[]>(sampleGroups);

  // Search, sort and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Getting unique values ​​for filters
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

  // Filtercurated and sorted data
  const filteredAndSortedData = useMemo(() => {
    let result = [...groups];

    // Search - search by title, specialization and curator
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(query) ||
          g.specialization.toLowerCase().includes(query) ||
          g.curator.toLowerCase().includes(query)
      );
    }

    // Filteration by specialization
    if (filters.specialization) {
      result = result.filter(g => g.specialization === filters.specialization);
    }

    // Filteration at the rate
    if (filters.year) {
      result = result.filter(g => g.year === filters.year);
    }

    // Filteration by status
    if (filters.status) {
      result = result.filter(g => g.status === filters.status);
    }

    // Sorting
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
    { key: 'name', label: t.columns.name },
    { key: 'specialization', label: t.columns.specialization },
    { key: 'year', label: t.columns.year },
    { key: 'students', label: t.columns.students },
    { key: 'curator', label: t.columns.curator },
    { key: 'status', label: t.columns.status },
  ];

  const filterOptions = [
    {
      name: 'specialization',
      label: t.columns.specialization,
      options: uniqueSpecializations.map(s => ({ label: s, value: s })),
    },
    {
      name: 'year',
      label: t.columns.year,
      options: uniqueYears.map(y => ({ label: y, value: y })),
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
          {t.total(groups.length)}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-cyan hover:bg-cyan/80 dark:bg-dark-cyan dark:hover:bg-dark-cyan/80 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          {t.addGroup}
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

      <Table<Group>
        columns={[
          { key: 'id', label: t.columns.id, width: '60px', sortable: true },
          { key: 'name', label: t.columns.name, sortable: true },
          { key: 'specialization', label: t.columns.specialization, sortable: true },
          { key: 'year', label: t.columns.year, sortable: true },
          { key: 'students', label: t.columns.students, sortable: true },
          { key: 'curator', label: t.columns.curator, sortable: true },
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

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
    { key: 'name', label: 'Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'year', label: 'Well' },
    { key: 'students', label: 'Students' },
    { key: 'curator', label: 'Curator' },
    { key: 'status', label: 'Status' },
  ];

  const filterOptions = [
    {
      name: 'specialization',
      label: 'Specialization',
      options: uniqueSpecializations.map(s => ({ label: s, value: s })),
    },
    {
      name: 'year',
      label: 'Well',
      options: uniqueYears.map(y => ({ label: y, value: y })),
    },
    {
      name: 'status',
      label: 'Status',
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
          ← Return to tables
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          Groups
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Allth groups: {groups.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Add a group
        </button>
      </div>

      <TableControls
        searchPlaceholder='Search by title, specialization, curator...'
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
          { key: 'name', label: 'Name', sortable: true },
          { key: 'specialization', label: 'Specialization', sortable: true },
          { key: 'year', label: 'Well', sortable: true },
          { key: 'students', label: 'Students', sortable: true },
          { key: 'curator', label: 'Curator', sortable: true },
          { key: 'status', label: 'Status', sortable: true },
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

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
    name: 'Professor Petrov AND.AND.',
    email: 'prof.petrov@example.com',
    department: 'Mathematics',
    subjects: 'Algebra, Geometry',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Associate Professor Sidorova M.IN.',
    email: 'doc.sidorova@example.com',
    department: 'ANDнформатAndToа',
    subjects: 'OOP, Bases data',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Assistant ANDванов A.A.',
    email: 'assist.ivanov@example.com',
    department: 'Physics',
    subjects: 'MеханAndToа, Thermodynamics',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Professor Smirnova E.P.',
    email: 'prof.smirnova@example.com',
    department: 'Literature',
    subjects: 'Russian literature',
    status: 'IN vacation',
  },
  {
    id: '5',
    name: 'Associate Professor Kozlov D.E.',
    email: 'doc.kozlov@example.com',
    department: 'History',
    subjects: 'Allpeaceful story, History Russia',
    status: 'Active',
  },
];

export default function TeachersTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [teachers] = useState<Teacher[]>(sampleTeachers);

  // PоAndсTo, sorting And фAndльтрацAndя
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // PолученAndе унAndToальных значенAndй For фAndльтров
  const uniqueDepartments = useMemo(
    () => [...new Set(teachers.map(t => t.department))].sort(),
    [teachers]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(teachers.map(t => t.status))].sort(),
    [teachers]
  );

  // Filterovated And отсортAndрovated data
  const filteredAndSortedData = useMemo(() => {
    let result = [...teachers];

    // PоAndсTo - Andщем By AndменAnd, email And дAndсцAndплAndнам
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.subjects.toLowerCase().includes(query)
      );
    }

    // FilterацAndя By department
    if (filters.department) {
      result = result.filter(t => t.department === filters.department);
    }

    // FilterацAndя By status
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Sorting
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
    { key: 'name', label: 'First name' },
    { key: 'department', label: 'Department' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ];

  const filterOptions = [
    {
      name: 'department',
      label: 'Department',
      options: uniqueDepartments.map(d => ({ label: d, value: d })),
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
          ← INернуться To таблAndцам
        </Link>
        <h1 className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
          PреByдавателAnd
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Allth преByдавателей: {teachers.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + DобавAndть преByдавателя
        </button>
      </div>

      <TableControls
        searchPlaceholder='PоAndсTo By AndменAnd, email, дAndсцAndплAndнам...'
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
          { key: 'name', label: 'First name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'department', label: 'Department', sortable: true },
          { key: 'subjects', label: 'DAndсцAndплAndны' },
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

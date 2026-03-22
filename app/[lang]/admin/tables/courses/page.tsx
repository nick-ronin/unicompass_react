'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  semester: string;
  students: string;
  status: string;
}

const sampleCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Programming',
    code: 'CS-101',
    teacher: 'Associate Professor Sidorova M.V..',
    semester: '1',
    students: '45',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Object-oriented programming',
    code: 'CS-201',
    teacher: 'Associate Professor Sidorova M.V..',
    semester: '2',
    students: '38',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Databases',
    code: 'CS-301',
    teacher: 'Associate Professor Sidorova M.V..',
    semester: '3',
    students: '32',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Web development',
    code: 'CS-302',
    teacher: 'Assistant Ivanov A.A..',
    semester: '3',
    students: '40',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Machine learning',
    code: 'CS-401',
    teacher: 'Professor Petrov I.I..',
    semester: '4',
    students: '28',
    status: 'Planned',
  },
  {
    id: '6',
    name: 'Computer networks',
    code: 'CS-302',
    teacher: 'Associate Professor Kozlov D.E..',
    semester: '3',
    students: '35',
    status: 'Active',
  },
];

export default function CoursesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [courses] = useState<Course[]>(sampleCourses);

  // Search, sort and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Getting unique values ​​for filters
  const uniqueSemesters = useMemo(
    () => [...new Set(courses.map(c => c.semester))].sort((a, b) => Number(a) - Number(b)),
    [courses]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(courses.map(c => c.status))].sort(),
    [courses]
  );

  // Filtercurated and sorted data
  const filteredAndSortedData = useMemo(() => {
    let result = [...courses];

    // Search - search by name, code and teacher
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.teacher.toLowerCase().includes(query)
      );
    }

    // Filteration by semester
    if (filters.semester) {
      result = result.filter(c => c.semester === filters.semester);
    }

    // Filteration by status
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Course] || '';
        const bValue = b[sortColumn as keyof Course] || '';

        let comparison = 0;
        if (sortColumn === 'students' || sortColumn === 'semester') {
          comparison = Number(aValue) - Number(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue), 'ru');
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [courses, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (course: Course) => {
    console.log('Edit course:', course);
  };

  const handleDelete = (course: Course) => {
    console.log('Delete course:', course);
  };

  const sortOptions: SortOption[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'semester', label: 'Semester' },
    { key: 'students', label: 'Students' },
    { key: 'status', label: 'Status' },
  ];

  const filterOptions = [
    {
      name: 'semester',
      label: 'Semester',
      options: uniqueSemesters.map(s => ({ label: s, value: s })),
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
          Courses
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Allth courses: {courses.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Add a course
        </button>
      </div>

      <TableControls
        searchPlaceholder='Search by name, code, teacher...'
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

      <Table<Course>
        columns={[
          { key: 'id', label: 'ID', width: '60px', sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          { key: 'code', label: 'Code', sortable: true },
          { key: 'teacher', label: 'Teacher', sortable: true },
          { key: 'semester', label: 'Semester', sortable: true },
          { key: 'students', label: 'Students', sortable: true },
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

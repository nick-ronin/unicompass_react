'use client';

import Table from '@/components/Table';
import TableControls, { SortOption } from '@/components/TableControls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Courses',
    total: (count: number) => `Total courses: ${count}`,
    addCourse: '+ Add course',
    searchPlaceholder: 'Search by name, code, teacher...',
    filters: 'Filters',
    reset: 'Reset',
    all: 'All',
    resultCount: (count: number) => `Results: ${count}`,
    columns: {
      id: 'ID',
      name: 'Name',
      code: 'Code',
      teacher: 'Teacher',
      semester: 'Semester',
      students: 'Students',
      status: 'Status',
    },
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Курсы',
    total: (count: number) => `Всего курсов: ${count}`,
    addCourse: '+ Добавить курс',
    searchPlaceholder: 'Поиск по названию, коду, преподавателю...',
    filters: 'Фильтры',
    reset: 'Сбросить',
    all: 'Все',
    resultCount: (count: number) => `Найдено: ${count}`,
    columns: {
      id: 'ID',
      name: 'Название',
      code: 'Код',
      teacher: 'Преподаватель',
      semester: 'Семестр',
      students: 'Студентов',
      status: 'Статус',
    },
  },
};

interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  semester: string;
  students: string;
  status: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Введение в программирование',
    code: 'CS-101',
    teacher: 'Доцент Марина Сидорова',
    semester: '1',
    students: '45',
    status: 'Активен',
  },
  {
    id: '2',
    name: 'Объектно-ориентированное программирование',
    code: 'CS-201',
    teacher: 'Доцент Марина Сидорова',
    semester: '2',
    students: '38',
    status: 'Активен',
  },
  {
    id: '3',
    name: 'Базы данных',
    code: 'CS-301',
    teacher: 'Доцент Диана Козлова',
    semester: '3',
    students: '32',
    status: 'Активен',
  },
  {
    id: '4',
    name: 'Веб-разработка',
    code: 'CS-310',
    teacher: 'Ассистент Алексей Иванов',
    semester: '3',
    students: '40',
    status: 'Активен',
  },
  {
    id: '5',
    name: 'Машинное обучение',
    code: 'CS-401',
    teacher: 'Проф. Ирина Петрова',
    semester: '4',
    students: '28',
    status: 'Планируется',
  },
  {
    id: '6',
    name: 'Компьютерные сети',
    code: 'CS-320',
    teacher: 'Доцент Диана Козлова',
    semester: '3',
    students: '35',
    status: 'Активен',
  },
  {
    id: '7',
    name: 'Тестирование ПО',
    code: 'CS-330',
    teacher: 'Ассистент Павел Смирнов',
    semester: '3',
    students: '30',
    status: 'Активен',
  },
  {
    id: '8',
    name: 'Основы UI/UX',
    code: 'DS-210',
    teacher: 'Преп. Анна Романова',
    semester: '2',
    students: '42',
    status: 'Планируется',
  },
];

export default function CoursesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [courses] = useState<Course[]>(mockCourses);

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

  // Filtered and sorted data (students page style)
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

    // Filter by semester
    if (filters.semester) {
      result = result.filter(c => c.semester === filters.semester);
    }

    // Filter by status
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
          comparison = String(aValue).localeCompare(String(bValue), lang === 'ru' ? 'ru' : 'en');
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
    { key: 'name', label: t.columns.name },
    { key: 'code', label: t.columns.code },
    { key: 'teacher', label: t.columns.teacher },
    { key: 'semester', label: t.columns.semester },
    { key: 'students', label: t.columns.students },
    { key: 'status', label: t.columns.status },
  ];

  const filterOptions = [
    {
      name: 'semester',
      label: t.columns.semester,
      options: uniqueSemesters.map(s => ({ label: s, value: s })),
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
          {t.total(courses.length)}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-cyan hover:bg-cyan/80 dark:bg-dark-cyan dark:hover:bg-dark-cyan/80 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          {t.addCourse}
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

      <Table<Course>
        columns={[
          { key: 'id', label: t.columns.id, width: '60px', sortable: true },
          { key: 'name', label: t.columns.name, sortable: true },
          { key: 'code', label: t.columns.code, sortable: true },
          { key: 'teacher', label: t.columns.teacher, sortable: true },
          { key: 'semester', label: t.columns.semester, sortable: true },
          { key: 'students', label: t.columns.students, sortable: true },
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

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
    name: 'Введение в программирование',
    code: 'CS-101',
    teacher: 'Доцент Сидорова М.В.',
    semester: '1',
    students: '45',
    status: 'Активен',
  },
  {
    id: '2',
    name: 'Объектно-ориентированное программирование',
    code: 'CS-201',
    teacher: 'Доцент Сидорова М.В.',
    semester: '2',
    students: '38',
    status: 'Активен',
  },
  {
    id: '3',
    name: 'Базы данных',
    code: 'CS-301',
    teacher: 'Доцент Сидорова М.В.',
    semester: '3',
    students: '32',
    status: 'Активен',
  },
  {
    id: '4',
    name: 'Веб-разработка',
    code: 'CS-302',
    teacher: 'Ассистент Иванов А.А.',
    semester: '3',
    students: '40',
    status: 'Активен',
  },
  {
    id: '5',
    name: 'Машинное обучение',
    code: 'CS-401',
    teacher: 'Профессор Петров И.И.',
    semester: '4',
    students: '28',
    status: 'Планируется',
  },
  {
    id: '6',
    name: 'Компьютерные сети',
    code: 'CS-302',
    teacher: 'Доцент Козлов Д.Е.',
    semester: '3',
    students: '35',
    status: 'Активен',
  },
];

export default function CoursesTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const [courses] = useState<Course[]>(sampleCourses);

  // Поиск, сортировка и фильтрация
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Получение уникальных значений для фильтров
  const uniqueSemesters = useMemo(
    () => [...new Set(courses.map(c => c.semester))].sort((a, b) => Number(a) - Number(b)),
    [courses]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(courses.map(c => c.status))].sort(),
    [courses]
  );

  // Фильтрованные и отсортированные данные
  const filteredAndSortedData = useMemo(() => {
    let result = [...courses];

    // Поиск - ищем по названию, коду и преподавателю
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.teacher.toLowerCase().includes(query)
      );
    }

    // Фильтрация по семестру
    if (filters.semester) {
      result = result.filter(c => c.semester === filters.semester);
    }

    // Фильтрация по статусу
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }

    // Сортировка
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
    { key: 'name', label: 'Название' },
    { key: 'code', label: 'Код' },
    { key: 'teacher', label: 'Преподаватель' },
    { key: 'semester', label: 'Семестр' },
    { key: 'students', label: 'Студентов' },
    { key: 'status', label: 'Статус' },
  ];

  const filterOptions = [
    {
      name: 'semester',
      label: 'Семестр',
      options: uniqueSemesters.map(s => ({ label: s, value: s })),
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
          Курсы
        </h1>
        <p className='text-gray-600 dark:text-gray-300'>
          Всего курсов: {courses.length}
        </p>
      </div>

      <div className='mb-6'>
        <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
          + Добавить курс
        </button>
      </div>

      <TableControls
        searchPlaceholder='Поиск по названию, коду, преподавателю...'
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
          { key: 'name', label: 'Название', sortable: true },
          { key: 'code', label: 'Код', sortable: true },
          { key: 'teacher', label: 'Преподаватель', sortable: true },
          { key: 'semester', label: 'Семестр', sortable: true },
          { key: 'students', label: 'Студентов', sortable: true },
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

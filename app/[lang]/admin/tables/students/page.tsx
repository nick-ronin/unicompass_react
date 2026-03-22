'use client';

import Table from '@/components/Table';
import TableControls, { SortOption, FilterOption } from '@/components/TableControls';
import StudentProfileModal from '@/components/StudentProfileModal';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

const translations = {
  en: {
    backToTables: '← Back to tables',
    title: 'Students',
    loading: 'Loading...',
    total: (count: number) => `Total students: ${count}`,
    fetchError: (status: number) => `Error while loading: ${status}`,
    unknownError: 'Unknown error',
    addStudent: '+ Add student',
    searchPlaceholder: 'Search by name, surname, email...',
    loadingData: 'Loading data...',
    errorPrefix: '⚠️ Error',
    studentsNotFound: 'Students not found',
    columns: {
      id: 'ID',
      firstName: 'First name',
      lastName: 'Last name',
      patronymic: 'Middle name',
      age: 'Age',
      citizenship: 'Citizenship',
      email: 'Email',
      phone: 'Phone',
      dob: 'Date of birth',
      address: 'Address',
    },
    resultCount: (count: number) => `Results: ${count}`,
  },
  ru: {
    backToTables: '← Назад к таблицам',
    title: 'Студенты',
    loading: 'Загрузка...',
    total: (count: number) => `Всего студентов: ${count}`,
    fetchError: (status: number) => `Ошибка при загрузке: ${status}`,
    unknownError: 'Неизвестная ошибка',
    addStudent: '+ Добавить студента',
    searchPlaceholder: 'Поиск по имени, фамилии, email...',
    loadingData: 'Загрузка данных...',
    errorPrefix: '⚠️ Ошибка',
    studentsNotFound: 'Студенты не найдены',
    columns: {
      id: 'ID',
      firstName: 'Имя',
      lastName: 'Фамилия',
      patronymic: 'Отчество',
      age: 'Возраст',
      citizenship: 'Гражданство',
      email: 'Email',
      phone: 'Телефон',
      dob: 'Дата рождения',
      address: 'Адрес',
    },
    resultCount: (count: number) => `Найдено: ${count}`,
  },
};

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  age: string;
  citizenship: string;
  login: string;
  password: string;
  date_of_birth: string;
  passport: string;
  address: string;
  email: string;
  phone_number: string;
}

export default function StudentsTablePage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = translations[(lang as keyof typeof translations) ?? 'ru'] || translations.ru;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, sorting And фAndльтрацAndя
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // ПрофAndль student
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/full_info_list');
        
        if (!response.ok) {
          throw new Error(t.fetchError(response.status));
        }
        
        const data = await response.json();
        
        const formattedStudents = (Array.isArray(data) ? data : data.results || []).map(
          (student: any, index: number) => ({
            id: student.id?.toString() || (index + 1).toString(),
            first_name: student.first_name || '',
            last_name: student.last_name || '',
            patronymic: student.patronymic || '',
            age: student.age?.toString() || '',
            citizenship: student.citizenship || '',
            login: student.login || '',
            password: '••••••••',
            date_of_birth: student.date_of_birth || '',
            passport: student.passport || '',
            address: student.address || '',
            email: student.email || '',
            phone_number: student.phone_number || '',
          })
        );
        
        setStudents(formattedStudents);
        setError(null);
      } catch (err) {
        console.error('ОшAndбToа прAnd loading students:', err);
        setError(err instanceof Error ? err.message : t.unknownError);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // ПолученAndе унAndToальных значенAndй For фAndльтров
  const uniqueCitizenships = useMemo(
    () => [...new Set(students.map(s => s.citizenship))].filter(Boolean).sort(),
    [students]
  );

  const uniqueAges = useMemo(
    () => [...new Set(students.map(s => s.age))].filter(Boolean).sort((a, b) => Number(a) - Number(b)),
    [students]
  );

  // Filterovated And отсортAndрovated data
  const filteredAndSortedData = useMemo(() => {
    let result = [...students];

    // Search - Andщем By AndменAnd, femmeorAnd, patronymic, email And логAndну
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.first_name.toLowerCase().includes(query) ||
          s.last_name.toLowerCase().includes(query) ||
          s.patronymic.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.login.toLowerCase().includes(query)
      );
    }

    // FilterацAndя By citizenship
    if (filters.citizenship) {
      result = result.filter(s => s.citizenship === filters.citizenship);
    }

    // FilterацAndя By age
    if (filters.age) {
      result = result.filter(s => s.age === filters.age);
    }

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Student] || '';
        const bValue = b[sortColumn as keyof Student] || '';

        let comparison = 0;
        if (typeof aValue === 'number' || typeof bValue === 'number') {
          comparison = Number(aValue) - Number(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue), lang === 'ru' ? 'ru' : 'en');
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [students, searchQuery, filters, sortColumn, sortDirection]);

  const handleEdit = (student: Student) => {
    setSelectedStudentId(student.id);
    setIsProfileModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    console.log('Delete student:', student);
  };

  const sortOptions: SortOption[] = [
    { key: 'first_name', label: t.columns.firstName },
    { key: 'last_name', label: t.columns.lastName },
    { key: 'age', label: t.columns.age },
    { key: 'citizenship', label: t.columns.citizenship },
    { key: 'email', label: t.columns.email },
  ];

  const filterOptions = [
    {
      name: 'citizenship',
      label: t.columns.citizenship,
      options: uniqueCitizenships.map(c => ({ label: c, value: c })),
    },
    {
      name: 'age',
      label: t.columns.age,
      options: uniqueAges.map(age => ({ label: age, value: age })),
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
            {loading ? t.loading : t.total(students.length)}
        </p>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg'>
          ⚠️ Error: {error}
          {t.errorPrefix}: {error}
        </div>
      )}

      {loading ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 dark:text-gray-300'>{t.loadingData}</p>
        </div>
      ) : (
        <>
          <div className='mb-6'>
            <button className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'>
              {t.addStudent}
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
          />

          <Table<Student>
            columns={[
              { key: 'id', label: t.columns.id, width: '60px', sortable: true },
              { key: 'first_name', label: t.columns.firstName, sortable: true },
              { key: 'last_name', label: t.columns.lastName, sortable: true },
              { key: 'patronymic', label: t.columns.patronymic, sortable: true },
              { key: 'age', label: t.columns.age, sortable: true },
              { key: 'citizenship', label: t.columns.citizenship, sortable: true },
              { key: 'email', label: t.columns.email, sortable: true },
              { key: 'phone_number', label: t.columns.phone, sortable: true },
              { key: 'date_of_birth', label: t.columns.dob },
              { key: 'address', label: t.columns.address },
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
        </>
      )}

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        studentId={selectedStudentId}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

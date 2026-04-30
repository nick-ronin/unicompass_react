import { useEffect, useState } from 'react';

interface TableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
  }>;
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  lang?: 'ru' | 'en';
  onRowClick?: (item: T) => void;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: Array<string | number>) => void;
}

export default function Table<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  error = null,
  onRetry,
  className = '',
  sortColumn = '',
  sortDirection = 'asc',
  onSort,
  lang = 'ru',
  onRowClick,
  enableSelection = false,
  onSelectionChange,
}: TableProps<T>) {
  const translations = {
    ru: {
      error: 'Ошибка загрузки данных:',
      retry: 'Повторить',
      empty: 'Нет данных для отображения',
      actions: 'Действия',
      edit: 'Редактировать',
      delete: 'Удалить',
      loading: 'Загрузка...',
    },
    en: {
      error: 'Error loading data:',
      retry: 'Try again',
      empty: 'No data to display',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
    },
  };

  const t = translations[lang] || translations.ru;
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const handleColumnSort = (columnKey: string, sortable?: boolean) => {
    if (!sortable || !onSort) return;
    
    if (sortColumn === columnKey) {
      onSort(columnKey, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(columnKey, 'asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(data.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className='overflow-x-auto rounded-lg'>
        <div className='space-y-3 p-4 animate-pulse sm:p-6'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-12 bg-light-blue-gray dark:bg-medium-blue-gray rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='overflow-x-auto rounded-lg border border-dark-orange bg-light-orange p-4 dark:border-dark-red dark:bg-dark-red/30 sm:p-6'>
        <p className='mb-4 text-dark-gray dark:text-white'>{t.error} {error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='cursor-pointer rounded bg-dark-orange px-4 py-2 text-white transition-colors hover:bg-orange'
          >
            {t.retry}
          </button>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='overflow-x-auto rounded-lg bg-light-blue-gray p-4 text-center dark:bg-dark-gray sm:p-6'>
        <p className='text-medium-blue-gray dark:text-light-blue-gray'>{t.empty}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg ${className}`}>
      <table className='min-w-full w-full'>
        <thead className='bg-light-blue-gray dark:bg-dark-gray'>
          <tr>
            {(onEdit || onDelete || enableSelection) && (
              <th className='w-8 px-3 py-3 text-left text-xs font-semibold text-dark-gray dark:text-white sm:px-6 sm:text-sm'>
                <input
                  type='checkbox'
                  onChange={handleSelectAll}
                  checked={selectedRows.length === data.length && data.length > 0}
                  className='w-4 h-4 rounded cursor-pointer'
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-3 py-3 text-left text-xs font-semibold text-dark-gray dark:text-white sm:px-6 sm:text-sm ${
                  column.sortable && onSort ? 'cursor-pointer hover:bg-light-blue-gray dark:hover:bg-dark-gray' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => handleColumnSort(String(column.key), column.sortable)}
              >
                <div className='flex items-center gap-2'>
                  {column.label}
                  {column.sortable && onSort && (
                    <span className='text-medium-blue-gray dark:text-light-blue-gray text-xs'>
                      {sortColumn === String(column.key) ? (sortDirection === 'asc' ? '↑' : '↓') : '⇅'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className='px-3 py-3 text-left text-xs font-semibold text-dark-gray dark:text-white sm:px-6 sm:text-sm'>
                {t.actions}
              </th>
            )}
          </tr>
        </thead>
        <tbody className=''>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`hover:bg-light-blue-gray dark:hover:bg-dark-gray transition-colors ${
                index % 2 === 0 ? 'bg-white dark:bg-surface' : 'bg-light-blue-gray dark:bg-dark-gray/70'
              } ${selectedRows.includes(item.id) ? 'bg-light-blue-gray dark:bg-dark-cyan/30' : ''}`}
            >
              {(onEdit || onDelete || enableSelection) && (
                <td className='px-3 py-3 text-xs sm:px-6 sm:text-sm'>
                  <input
                    type='checkbox'
                    checked={selectedRows.includes(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(item.id);
                    }}
                    className='w-4 h-4 rounded cursor-pointer'
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={`px-3 py-3 text-xs text-dark-gray dark:text-light-blue-gray sm:px-6 sm:text-sm ${onRowClick ? 'cursor-pointer' : ''}`}
                  style={{ width: column.width }}
                >
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className='px-3 py-3 text-xs sm:px-6 sm:text-sm'>
                  <div className='flex gap-2'>
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        className='cursor-pointer font-medium text-dark-cyan hover:underline dark:text-cyan'
                      >
                        {t.edit}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item);
                        }}
                        className='cursor-pointer font-medium text-dark-orange hover:underline dark:text-orange'
                      >
                        {t.delete}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

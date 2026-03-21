import { useState } from 'react';

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
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

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
      <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
        <div className='p-6 space-y-3 animate-pulse'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-12 bg-gray-300 dark:bg-gray-700 rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='overflow-x-auto rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-6'>
        <p className='text-red-600 dark:text-red-400 mb-4'>Ошибка при загрузке данных: {error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
          >
            Попробовать ещё
          </button>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 text-center'>
        <p className='text-gray-500 dark:text-gray-400'>Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <table className='w-full'>
        <thead className='bg-gray-50 dark:bg-gray-900'>
          <tr>
            {(onEdit || onDelete) && (
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 w-8'>
                <input
                  type='checkbox'
                  onChange={handleSelectAll}
                  checked={selectedRows.length === data.length && data.length > 0}
                  className='w-4 h-4 rounded border-gray-300 dark:border-gray-600'
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 ${
                  column.sortable && onSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => handleColumnSort(String(column.key), column.sortable)}
              >
                <div className='flex items-center gap-2'>
                  {column.label}
                  {column.sortable && onSort && (
                    <span className='text-gray-400 dark:text-gray-500 text-xs'>
                      {sortColumn === String(column.key) ? (sortDirection === 'asc' ? '↑' : '↓') : '⇅'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700'>
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
              } ${selectedRows.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              {(onEdit || onDelete) && (
                <td className='px-6 py-3 text-sm'>
                  <input
                    type='checkbox'
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    className='w-4 h-4 rounded border-gray-300 dark:border-gray-600'
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className='px-6 py-3 text-sm text-gray-700 dark:text-gray-300'
                  style={{ width: column.width }}
                >
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className='px-6 py-3 text-sm flex gap-2'>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                    >
                      Редактировать
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className='text-red-600 dark:text-red-400 hover:underline font-medium'
                    >
                      Удалить
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

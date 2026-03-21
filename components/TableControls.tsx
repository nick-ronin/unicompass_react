'use client';

import { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  key: string;
  label: string;
}

interface TableControlsProps {
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  filterOptions?: Array<{
    name: string;
    label: string;
    options: FilterOption[];
  }>;
  onSearch?: (query: string) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  resultCount?: number;
}

export default function TableControls({
  searchPlaceholder = 'Поиск...',
  sortOptions = [],
  filterOptions = [],
  onSearch,
  onSort,
  onFilter,
  resultCount,
}: TableControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      // Переключаем направление сортировки
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      onSort?.(key, newDirection);
    } else {
      // Устанавливаем новый ключ сортировки
      setSortKey(key);
      setSortDirection('asc');
      onSort?.(key, 'asc');
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[filterName] = value;
    } else {
      delete newFilters[filterName];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setSortKey('');
    setSortDirection('asc');
    onSearch?.('');
    onSort?.('', 'asc');
    onFilter?.({});
  };

  const hasActiveFilters = searchQuery || sortKey || Object.keys(activeFilters).length > 0;

  return (
    <div className='space-y-4 mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50'>
      {/* Поиск */}
      <div className='flex gap-2 items-center'>
        <div className='flex-1 relative'>
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            >
              ✕
            </button>
          )}
        </div>

        {/* Кнопка для фильтров */}
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'
            }`}
          >
            Фильтры {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
          </button>
        )}

        {/* Кнопка сброса */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 rounded-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Сортировка и информация */}
      {(sortOptions.length > 0 || resultCount !== undefined) && (
        <div className='flex gap-2 items-center flex-wrap'>
          {sortOptions.length > 0 && (
            <select
              value={sortKey}
              onChange={(e) => handleSort(e.target.value)}
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
            >
              <option value=''>Сортировка по...</option>
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label} {sortKey === opt.key && (sortDirection === 'asc' ? '↑' : '↓')}
                </option>
              ))}
            </select>
          )}

          {resultCount !== undefined && (
            <span className='text-sm text-gray-600 dark:text-gray-400 ml-auto'>
              Найдено: {resultCount}
            </span>
          )}
        </div>
      )}

      {/* Фильтры */}
      {showFilters && filterOptions.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700'>
          {filterOptions.map((filter) => (
            <div key={filter.name}>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                {filter.label}
              </label>
              <select
                value={activeFilters[filter.name] || ''}
                onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm'
              >
                <option value=''>Все</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

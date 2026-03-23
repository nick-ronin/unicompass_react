'use client';

import { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

interface TableControlsProps {
  searchPlaceholder?: string;
  filterOptions?: Array<{
    name: string;
    label: string;
    options: FilterOption[];
  }>;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  resultCount?: number;
  labels?: {
    filters: string;
    reset: string;
    found: (count: number) => string;
    all: string;
  };
}

export default function TableControls({
  searchPlaceholder = 'Search...',
  filterOptions = [],
  onSearch,
  onFilter,
  resultCount,
  labels = {
    filters: 'Filters',
    reset: 'Reset',
    found: (count: number) => `Found: ${count}`,
    all: 'All',
  },
}: TableControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
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
    onSearch?.('');
    onFilter?.({});
  };

  const hasActiveFilters = searchQuery || Object.keys(activeFilters).length > 0;

  return (
    <div className='space-y-4 mb-6 rounded-lg p-4 bg-light-blue-gray dark:bg-dark-gray/60'>
      {/* Search */}
      <div className='flex gap-2 items-center'>
        <div className='flex-1 relative'>
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 focus:ring-dark-cyan'
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-medium-blue-gray hover:text-dark-gray dark:hover:text-white cursor-pointer'
            >
              ✕
            </button>
          )}
        </div>

        {/* Button For filters */}
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? 'bg-dark-cyan text-white'
                : 'bg-white dark:bg-surface-secondary text-dark-gray dark:text-white'
            } cursor-pointer`}
          >
            {labels.filters} {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
          </button>
        )}

        {/* Button reset */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 rounded-lg font-medium bg-white dark:bg-surface-secondary text-dark-gray dark:text-white hover:bg-light-blue-gray dark:hover:bg-dark-cyan/30 transition-colors cursor-pointer'
          >
            {labels.reset}
          </button>
        )}
      </div>

      {/* Sorting And AndнформацAndя */}
      {resultCount !== undefined && (
        <div className='flex gap-2 items-center flex-wrap'>
          <span className='text-sm text-medium-blue-gray dark:text-light-blue-gray ml-auto'>
            {labels.found(resultCount)}
          </span>
        </div>
      )}

      {/* Filters */}
      {showFilters && filterOptions.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2'>
          {filterOptions.map((filter) => (
            <div key={filter.name}>
              <label className='block text-sm font-medium text-dark-gray dark:text-light-blue-gray mb-1'>
                {filter.label}
              </label>
              <select
                value={activeFilters[filter.name] || ''}
                onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                className='w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-gray text-dark-gray dark:text-white text-sm'
              >
                <option value=''>{labels.all}</option>
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

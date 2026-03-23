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
  filterOptions?: Array<{
    name: string;
    label: string;
    options: FilterOption[];
  }>;
  sortOptions?: SortOption[];
  onSearch?: (query: string) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  resultCount?: number;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  labels?: {
    filters: string;
    reset: string;
    found: (count: number) => string;
    all: string;
    sortBy?: string;
    asc?: string;
    desc?: string;
    noSort?: string;
  };
}

export default function TableControls({
  searchPlaceholder = 'Search...',
  filterOptions = [],
  sortOptions = [],
  onSearch,
  onSort,
  onFilter,
  resultCount,
  defaultSortKey = '',
  defaultSortDirection = 'asc',
  labels,
}: TableControlsProps) {
  const defaultLabels = {
    filters: 'Filters',
    reset: 'Reset',
    found: (count: number) => `Found: ${count}`,
    all: 'All',
    sortBy: 'Sort by',
    asc: 'Asc',
    desc: 'Desc',
    noSort: 'No sorting',
  };

  const mergedLabels = {
    ...defaultLabels,
    ...labels,
    found: labels?.found ?? defaultLabels.found,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
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

  const handleSortChange = (key: string) => {
    setSortKey(key);
    if (onSort) {
      const directionToUse = key ? sortDirection : defaultSortDirection;
      onSort(key, directionToUse);
    }
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    if (sortKey) {
      onSort?.(sortKey, newDirection);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setSortKey(defaultSortKey);
    setSortDirection(defaultSortDirection);
    onSearch?.('');
    onFilter?.({});
    onSort?.(defaultSortKey, defaultSortDirection);
  };

  const hasActiveFilters = Boolean(
    searchQuery || Object.keys(activeFilters).length > 0 || sortKey
  );

  return (
    <div className='space-y-4 mb-6 rounded-lg p-4 bg-light-blue-gray dark:bg-surface'>
      {/* Search */}
      <div className='flex gap-2 items-center'>
        <div className='flex-1 relative'>
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full px-4 py-2 rounded-lg bg-white dark:bg-surface-secondary text-dark-gray dark:text-white placeholder-medium-blue-gray focus:outline-none focus:ring-2 focus:ring-dark-cyan'
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
            {mergedLabels.filters} {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
          </button>
        )}

        {/* Button reset */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 rounded-lg font-medium bg-white dark:bg-surface-secondary text-dark-gray dark:text-white hover:bg-light-blue-gray dark:hover:bg-dark-cyan/30 transition-colors cursor-pointer'
          >
            {mergedLabels.reset}
          </button>
        )}
      </div>

      {/* Sorting And info */}
      {(sortOptions.length > 0 || resultCount !== undefined) && (
        <div className='flex gap-3 items-center flex-wrap'>
          {sortOptions.length > 0 && (
            <div className='flex items-center gap-2 flex-wrap'>
              <label className='text-sm text-dark-gray dark:text-light-blue-gray'>
                {mergedLabels.sortBy}
              </label>
              <select
                value={sortKey}
                onChange={(e) => handleSortChange(e.target.value)}
                className='px-3 py-2 rounded-lg bg-white dark:bg-surface-secondary text-dark-gray dark:text-white text-sm'
              >
                <option value=''>
                  {mergedLabels.noSort}
                </option>
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortDirection}
                disabled={!sortKey}
                className='px-3 py-2 rounded-lg bg-white dark:bg-surface-secondary text-dark-gray dark:text-white text-sm disabled:opacity-60 cursor-pointer'
              >
                {sortDirection === 'asc' ? mergedLabels.asc : mergedLabels.desc}
              </button>
            </div>
          )}

          {resultCount !== undefined && (
            <span className='text-sm text-medium-blue-gray dark:text-light-blue-gray ml-auto'>
              {mergedLabels.found(resultCount)}
            </span>
          )}
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
                <option value=''>{mergedLabels.all}</option>
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

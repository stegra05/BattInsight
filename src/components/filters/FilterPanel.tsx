import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataPoint } from '../../services/DataService';

interface FilterOptions {
  countries: string[];
  continents: string[];
  climates: string[];
  valueRange: {
    min: number;
    max: number;
  };
}

interface FilterPanelProps {
  data: DataPoint[];
  filterOptions: FilterOptions;
  onFilterChange: (filteredData: DataPoint[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  data, 
  filterOptions, 
  onFilterChange 
}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    countries: string[];
    continents: string[];
    climates: string[];
  }>({
    countries: [],
    continents: [],
    climates: []
  });
  const [valueRange, setValueRange] = useState<[number, number]>([
    filterOptions.valueRange.min,
    filterOptions.valueRange.max
  ]);
  const [quickFilterMode, setQuickFilterMode] = useState<'all' | 'high' | 'low' | 'custom'>('all');
  const [activeTab, setActiveTab] = useState<'countries' | 'continents' | 'climates' | 'values'>('countries');
  const [expanded, setExpanded] = useState(true);
  const [displayedVariable, setDisplayedVariable] = useState('');

  // Determine the displayed variable based on the data
  useEffect(() => {
    if (data.length > 0 && data[0].variable) {
      setDisplayedVariable(data[0].variable);
    }
  }, [data]);

  // Derived state for UI
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += selectedFilters.countries.length;
    count += selectedFilters.continents.length;
    count += selectedFilters.climates.length;
    if (valueRange[0] !== filterOptions.valueRange.min || 
        valueRange[1] !== filterOptions.valueRange.max) {
      count += 1;
    }
    return count;
  }, [selectedFilters, valueRange, filterOptions.valueRange]);

  // Apply filters and update parent component
  const applyFilters = useCallback(() => {
    let filteredResults = [...data];
    
    // Apply search filter first (across country, continent, and climate)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filteredResults = filteredResults.filter(point => 
        point.country.toLowerCase().includes(term) ||
        point.continent.toLowerCase().includes(term) ||
        point.climate.toLowerCase().includes(term)
      );
    }
    
    // Apply country filter
    if (selectedFilters.countries.length > 0) {
      filteredResults = filteredResults.filter(point => 
        selectedFilters.countries.includes(point.country)
      );
    }
    
    // Apply continent filter
    if (selectedFilters.continents.length > 0) {
      filteredResults = filteredResults.filter(point => 
        selectedFilters.continents.includes(point.continent)
      );
    }
    
    // Apply climate filter
    if (selectedFilters.climates.length > 0) {
      filteredResults = filteredResults.filter(point => 
        selectedFilters.climates.includes(point.climate)
      );
    }
    
    // Apply value range filter
    filteredResults = filteredResults.filter(point => 
      point.value >= valueRange[0] && point.value <= valueRange[1]
    );
    
    onFilterChange(filteredResults);
  }, [data, selectedFilters, valueRange, searchTerm, onFilterChange]);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [selectedFilters, valueRange, searchTerm, applyFilters]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilters({
      countries: [],
      continents: [],
      climates: []
    });
    setValueRange([filterOptions.valueRange.min, filterOptions.valueRange.max]);
    setQuickFilterMode('all');
  };

  // Toggle selection for filter items
  const toggleFilter = (item: string, type: 'countries' | 'continents' | 'climates') => {
    setSelectedFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(item);
      
      if (index === -1) {
        // Add item
        return {
          ...prev,
          [type]: [...current, item]
        };
      } else {
        // Remove item
        current.splice(index, 1);
        return {
          ...prev,
          [type]: current
        };
      }
    });
    
    // When manually selecting filters, switch to custom mode
    setQuickFilterMode('custom');
  };

  // Apply quick filters
  const applyQuickFilter = (mode: 'all' | 'high' | 'low' | 'custom') => {
    setQuickFilterMode(mode);
    
    // Reset existing filters first
    setSelectedFilters({
      countries: [],
      continents: [],
      climates: []
    });
    
    if (mode === 'all') {
      // Show all data
      setValueRange([filterOptions.valueRange.min, filterOptions.valueRange.max]);
    } else if (mode === 'high') {
      // Show only high values (top 25%)
      const threshold = filterOptions.valueRange.min + 
        (filterOptions.valueRange.max - filterOptions.valueRange.min) * 0.75;
      setValueRange([threshold, filterOptions.valueRange.max]);
    } else if (mode === 'low') {
      // Show only low values (bottom 25%)
      const threshold = filterOptions.valueRange.min + 
        (filterOptions.valueRange.max - filterOptions.valueRange.min) * 0.25;
      setValueRange([filterOptions.valueRange.min, threshold]);
    }
    // 'custom' mode doesn't change anything, it just indicates user has made manual selections
  };

  // Get filtered options based on search term
  const getFilteredOptions = (type: 'countries' | 'continents' | 'climates') => {
    const options = filterOptions[type];
    if (!searchTerm.trim()) return options;
    
    const term = searchTerm.toLowerCase().trim();
    return options.filter(option => option.toLowerCase().includes(term));
  };

  // Determine if a filter category has active filters
  const hasActiveFilters = (type: 'countries' | 'continents' | 'climates' | 'values') => {
    if (type === 'values') {
      return valueRange[0] !== filterOptions.valueRange.min || 
             valueRange[1] !== filterOptions.valueRange.max;
    }
    return selectedFilters[type].length > 0;
  };

  // Calculate and format the filtered data percentage
  const getFilteredPercentage = () => {
    const percentage = (data.length / filterOptions.countries.length) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Data Filters</h2>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Displaying <span className="font-medium">{displayedVariable || 'data'}</span>
              </span>
              {activeFilterCount > 0 && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activeFilterCount} active filters
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={resetFilters}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {expanded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Collapse
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Expand
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Stats Ribbon */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-300 mr-1">Showing:</span>
            <span className="font-medium text-gray-800 dark:text-white">{data.length} data points</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-300 mr-1">Coverage:</span>
            <span className="font-medium text-gray-800 dark:text-white">{getFilteredPercentage()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => applyQuickFilter('all')}
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              quickFilterMode === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Data
          </button>
          <button
            onClick={() => applyQuickFilter('high')}
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              quickFilterMode === 'high'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            High Values
          </button>
          <button
            onClick={() => applyQuickFilter('low')}
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              quickFilterMode === 'low'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Low Values
          </button>
          {quickFilterMode === 'custom' && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Custom Filters
            </span>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {expanded && (
        <div className="p-4">
          {/* Search input */}
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Search countries, continents, or climate types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('countries')}
                className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'countries'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Countries
                {hasActiveFilters('countries') && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
                    {selectedFilters.countries.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('continents')}
                className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'continents'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Continents
                {hasActiveFilters('continents') && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
                    {selectedFilters.continents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('climates')}
                className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'climates'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Climates
                {hasActiveFilters('climates') && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
                    {selectedFilters.climates.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'values'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Values
                {hasActiveFilters('values') && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          {/* Filter content */}
          <div className="mt-4">
            {/* Countries tab */}
            {activeTab === 'countries' && (
              <div className="max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('countries').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {getFilteredOptions('countries').map(country => (
                      <button
                        key={country}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors ${
                          selectedFilters.countries.includes(country)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => toggleFilter(country, 'countries')}
                      >
                        <span className="truncate">{country}</span>
                        {selectedFilters.countries.includes(country) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-center">No countries found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Continents tab */}
            {activeTab === 'continents' && (
              <div className="max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('continents').length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getFilteredOptions('continents').map(continent => (
                      <button
                        key={continent}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedFilters.continents.includes(continent)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => toggleFilter(continent, 'continents')}
                      >
                        {continent}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-center">No continents found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Climates tab */}
            {activeTab === 'climates' && (
              <div className="max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('climates').length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getFilteredOptions('climates').map(climate => (
                      <button
                        key={climate}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedFilters.climates.includes(climate)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => toggleFilter(climate, 'climates')}
                      >
                        {climate}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-center">No climate types found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Values tab */}
            {activeTab === 'values' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">High</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-800 dark:text-white">Min: {valueRange[0]}</span>
                  <span className="font-medium text-gray-800 dark:text-white">Max: {valueRange[1]}</span>
                </div>
                
                <div className="mb-6">
                  <div className="relative h-2 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-30 dark:opacity-20"></div>
                    <div 
                      className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ 
                        width: `${((valueRange[1] - valueRange[0]) / (filterOptions.valueRange.max - filterOptions.valueRange.min)) * 100}%`, 
                        left: `${((valueRange[0] - filterOptions.valueRange.min) / (filterOptions.valueRange.max - filterOptions.valueRange.min)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Value</label>
                    <input
                      type="range"
                      min={filterOptions.valueRange.min}
                      max={filterOptions.valueRange.max}
                      value={valueRange[0]}
                      onChange={(e) => {
                        const min = parseInt(e.target.value);
                        const max = valueRange[1];
                        if (min <= max) {
                          setValueRange([min, max]);
                          setQuickFilterMode('custom');
                        }
                      }}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Value</label>
                    <input
                      type="range"
                      min={filterOptions.valueRange.min}
                      max={filterOptions.valueRange.max}
                      value={valueRange[1]}
                      onChange={(e) => {
                        const min = valueRange[0];
                        const max = parseInt(e.target.value);
                        if (min <= max) {
                          setValueRange([min, max]);
                          setQuickFilterMode('custom');
                        }
                      }}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer Stats */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {data.length} of {filterOptions.countries.length * 3} data points
        </span>
        <div className="flex space-x-2">
          <button
            onClick={applyFilters}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
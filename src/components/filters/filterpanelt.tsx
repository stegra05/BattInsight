import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataPoint } from '../../services/DataService';
import './filterpanel.css';

// Enhanced FilterOptions interface with variables support
interface FilterOptions {
  countries: string[];
  continents: string[];
  climates: string[];
  variables: string[];  // Added variables array
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

// Filter state interface
interface FilterState {
  countries: string[];
  continents: string[];
  climates: string[];
  variables: string[];  // Added variables array to state
  searchTerm: string;
  valueRange: [number, number];
}

const FilterPanelT: React.FC<FilterPanelProps> = ({ 
  data, 
  filterOptions, 
  onFilterChange 
}) => {
  // Filter states with variables support
  const [filters, setFilters] = useState<FilterState>({
    countries: [],
    continents: [],
    climates: [],
    variables: [],
    searchTerm: '',
    valueRange: [
      filterOptions.valueRange.min,
      filterOptions.valueRange.max
    ]
  });
  
  // UI state
  const [activeCategory, setActiveCategory] = useState<'countries' | 'continents' | 'climates' | 'variables' | 'values'>('variables');
  const [expanded, setExpanded] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'quick' | 'advanced'>('all');
  const [visibleFilters, setVisibleFilters] = useState<{
    countries: boolean;
    continents: boolean;
    climates: boolean;
    variables: boolean;
    values: boolean;
  }>({
    countries: true,
    continents: true,
    climates: true,
    variables: true,
    values: true
  });
  
  // Animation state
  const [animateIn, setAnimateIn] = useState(false);
  
  // Visual feedback for filter changes
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Trigger animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Calculate active filter count for badge display
  const activeFilterCount = useMemo(() => {
    return (
      filters.countries.length +
      filters.continents.length +
      filters.climates.length +
      filters.variables.length +
      (filters.valueRange[0] !== filterOptions.valueRange.min || filters.valueRange[1] !== filterOptions.valueRange.max ? 1 : 0)
    );
  }, [filters, filterOptions.valueRange.min, filterOptions.valueRange.max]);

  // Add filteredData calculation
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // If any filters are active, check them
      if (filters.countries.length > 0 && !filters.countries.includes(item.country)) {
        return false;
      }
      
      if (filters.continents.length > 0 && !filters.continents.includes(item.continent)) {
        return false;
      }
      
      if (filters.climates.length > 0 && !filters.climates.includes(item.climate)) {
        return false;
      }
      
      if (filters.variables.length > 0 && !filters.variables.includes(item.variable)) {
        return false;
      }
      
      // Check value range
      if (item.value < filters.valueRange[0] || item.value > filters.valueRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [data, filters]);

  // Apply filters to data
  const applyFilters = useCallback(() => {
    let filteredResults = [...data];
    
    // Apply search filter
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase().trim();
      filteredResults = filteredResults.filter(point => 
        (point.country && point.country.toLowerCase().includes(term)) ||
        (point.continent && point.continent.toLowerCase().includes(term)) ||
        (point.climate && point.climate.toLowerCase().includes(term)) ||
        (point.variable && point.variable.toLowerCase().includes(term))
      );
    }
    
    // Apply country filter
    if (filters.countries.length > 0) {
      filteredResults = filteredResults.filter(point => 
        filters.countries.includes(point.country)
      );
    }
    
    // Apply continent filter
    if (filters.continents.length > 0) {
      filteredResults = filteredResults.filter(point => 
        filters.continents.includes(point.continent)
      );
    }
    
    // Apply climate filter
    if (filters.climates.length > 0) {
      filteredResults = filteredResults.filter(point => 
        filters.climates.includes(point.climate)
      );
    }
    
    // Apply variable filter (new)
    if (filters.variables.length > 0) {
      filteredResults = filteredResults.filter(point => 
        filters.variables.includes(point.variable)
      );
    }
    
    // Apply value range filter
    filteredResults = filteredResults.filter(point => 
      point.value >= filters.valueRange[0] && point.value <= filters.valueRange[1]
    );
    
    onFilterChange(filteredResults);
  }, [data, filters, onFilterChange]);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      countries: [],
      continents: [],
      climates: [],
      variables: [],
      searchTerm: '',
      valueRange: [filterOptions.valueRange.min, filterOptions.valueRange.max]
    });
    setFilterMode('all');
    setLastUpdated('all filters');
    
    // Visual feedback animation
    const element = document.getElementById('filter-reset-btn');
    if (element) {
      element.classList.add('animate-pulse');
      setTimeout(() => {
        element.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  // Toggle individual filter item
  const toggleFilter = (item: string, type: 'countries' | 'continents' | 'climates' | 'variables') => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(item);
      
      let newList;
      if (index === -1) {
        // Add item
        newList = [...current, item];
      } else {
        // Remove item
        newList = current.filter(i => i !== item);
      }
      
      setLastUpdated(type === 'variables' ? `variable: ${item}` : item);
      
      return {
        ...prev,
        [type]: newList
      };
    });
    
    setFilterMode('advanced');
  };

  // Get filtered options for different categories
  const getFilteredOptions = (type: 'countries' | 'continents' | 'climates' | 'variables') => {
    const options = filterOptions[type];
    if (!filters.searchTerm.trim()) return options;
    
    const term = filters.searchTerm.toLowerCase().trim();
    return options.filter(option => option.toLowerCase().includes(term));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  // Handle value range changes
  const handleRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      valueRange: [min, max]
    }));
    setLastUpdated(`value range: ${min}-${max}`);
  };

  // Toggle visibility of filter sections
  const toggleFilterVisibility = (type: 'countries' | 'continents' | 'climates' | 'variables' | 'values') => {
    setVisibleFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Set active category
  const setActive = (category: 'countries' | 'continents' | 'climates' | 'variables' | 'values') => {
    setActiveCategory(category);
  };

  return (
    <div className={`filter-panel bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header with title and controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Advanced Filters</h2>
              <div className="flex items-center mt-1">
                {activeFilterCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                    {activeFilterCount} active
                  </span>
                )}
                {lastUpdated && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {lastUpdated}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="filter-reset-btn"
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Reset</span>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {expanded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Expand</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter stats ribbon */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{data.length}</span> data points
          </span>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-1">Mode:</span>
            <span className={`font-medium ${
              filterMode === 'all' ? 'text-green-600 dark:text-green-400' :
              filterMode === 'quick' ? 'text-blue-600 dark:text-blue-400' :
              'text-purple-600 dark:text-purple-400'
            }`}>
              {filterMode === 'all' ? 'All Data' : 
              filterMode === 'quick' ? 'Quick Filter' : 
              'Advanced Filter'}
            </span>
          </div>
        </div>
      </div>

      {/* Main filter content - collapsible */}
      {expanded && (
        <div className="p-4">
          {/* Search input */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search countries, continents, climate types, or variables..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {filters.searchTerm && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter category tabs */}
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActive('variables')}
                className={`py-2 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === 'variables'
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } ${filters.variables.length > 0 ? 'font-semibold' : ''}`}
              >
                Variables
                {filters.variables.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {filters.variables.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActive('countries')}
                className={`py-2 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === 'countries'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } ${filters.countries.length > 0 ? 'font-semibold' : ''}`}
              >
                Countries
                {filters.countries.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {filters.countries.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActive('continents')}
                className={`py-2 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === 'continents'
                    ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } ${filters.continents.length > 0 ? 'font-semibold' : ''}`}
              >
                Continents
                {filters.continents.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {filters.continents.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActive('climates')}
                className={`py-2 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === 'climates'
                    ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } ${filters.climates.length > 0 ? 'font-semibold' : ''}`}
              >
                Climates
                {filters.climates.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {filters.climates.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActive('values')}
                className={`py-2 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === 'values'
                    ? 'border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } ${
                  filters.valueRange[0] !== filterOptions.valueRange.min || 
                  filters.valueRange[1] !== filterOptions.valueRange.max 
                    ? 'font-semibold' : ''
                }`}
              >
                Values
                {(filters.valueRange[0] !== filterOptions.valueRange.min || 
                  filters.valueRange[1] !== filterOptions.valueRange.max) && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
              </button>
            </nav>
          </div>

          {/* Filter content area */}
          <div className="mt-3">
            {/* Variables tab */}
            {activeCategory === 'variables' && (
              <div className="animate-slide-in">
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Variables</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        // Select all variables
                        setFilters(prev => ({
                          ...prev,
                          variables: [...filterOptions.variables]
                        }));
                        setLastUpdated('all variables');
                      }}
                      className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50 transition-colors"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={() => {
                        // Deselect all variables
                        setFilters(prev => ({
                          ...prev,
                          variables: []
                        }));
                        setLastUpdated('cleared variables');
                      }}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                {/* Variables grid with grouping by prefix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                  {getFilteredOptions('variables').length > 0 ? (
                    getFilteredOptions('variables').map(variable => (
                      <div 
                        key={variable}
                        onClick={() => toggleFilter(variable, 'variables')}
                        className={`group px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                          filters.variables.includes(variable)
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              filters.variables.includes(variable)
                                ? 'bg-indigo-500 dark:bg-indigo-400'
                                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                            }`}></div>
                            <span className="font-medium truncate" title={variable}>
                              {variable}
                            </span>
                          </div>
                          {filters.variables.includes(variable) && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Show variable count if available */}
                        {data.filter(d => d.variable === variable).length > 0 && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {data.filter(d => d.variable === variable).length} data points
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-center">No variables found matching "{filters.searchTerm}"</p>
                    </div>
                  )}
                </div>
                
                {/* Active variable filters */}
                {filters.variables.length > 0 && (
                  <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200 mb-2">
                      Selected Variables ({filters.variables.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {filters.variables.map(v => (
                        <span 
                          key={v}
                          className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800/40 text-indigo-800 dark:text-indigo-200"
                        >
                          {v}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilter(v, 'variables');
                            }}
                            className="ml-1 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Countries tab */}
            {activeCategory === 'countries' && (
              <div className="animate-slide-in max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('countries').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {getFilteredOptions('countries').map(country => (
                      <button
                        key={country}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors ${
                          filters.countries.includes(country)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => toggleFilter(country, 'countries')}
                      >
                        <span className="truncate">{country}</span>
                        {filters.countries.includes(country) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 flex-shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    <p className="text-center">No countries found matching "{filters.searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Continents tab */}
            {activeCategory === 'continents' && (
              <div className="animate-slide-in max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('continents').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {getFilteredOptions('continents').map(continent => (
                      <button
                        key={continent}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors ${
                          filters.continents.includes(continent)
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                            : 'bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => toggleFilter(continent, 'continents')}
                      >
                        <span className="truncate">{continent}</span>
                        {filters.continents.includes(continent) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 flex-shrink-0 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">No continents found matching "{filters.searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Climates tab */}
            {activeCategory === 'climates' && (
              <div className="animate-slide-in max-h-60 overflow-y-auto p-1">
                {getFilteredOptions('climates').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {getFilteredOptions('climates').map(climate => (
                      <button
                        key={climate}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors ${
                          filters.climates.includes(climate)
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                            : 'bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => toggleFilter(climate, 'climates')}
                      >
                        <span className="truncate">{climate}</span>
                        {filters.climates.includes(climate) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 flex-shrink-0 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <p className="text-center">No climates found matching "{filters.searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Values tab */}
            {activeCategory === 'values' && (
              <div className="animate-slide-in p-1">
                <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Value Range</h3>
                    <span className="text-xs px-2 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 rounded-md">
                      {filters.valueRange[0]} - {filters.valueRange[1]}
                    </span>
                  </div>
                  
                  <div className="mt-2 px-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200 dark:bg-rose-900/20 dark:text-rose-300">
                            Min: {filters.valueRange[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200 dark:bg-rose-900/20 dark:text-rose-300">
                            Max: {filters.valueRange[1]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4 h-1 relative bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="absolute h-1 rounded-full bg-rose-500 dark:bg-rose-400" 
                          style={{
                            left: `${((filters.valueRange[0] - filterOptions.valueRange.min) / (filterOptions.valueRange.max - filterOptions.valueRange.min)) * 100}%`,
                            right: `${100 - ((filters.valueRange[1] - filterOptions.valueRange.min) / (filterOptions.valueRange.max - filterOptions.valueRange.min)) * 100}%`
                          }}
                        ></div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <div className="w-1/2">
                          <label htmlFor="min-value" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Minimum Value
                          </label>
                          <input
                            type="range"
                            id="min-value"
                            min={filterOptions.valueRange.min}
                            max={filterOptions.valueRange.max}
                            value={filters.valueRange[0]}
                            onChange={(e) => {
                              const newMin = parseInt(e.target.value);
                              const newMax = Math.max(filters.valueRange[1], newMin);
                              setFilters(prev => ({ ...prev, valueRange: [newMin, newMax] }));
                              setLastUpdated('value range');
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-rose-500 dark:accent-rose-400"
                          />
                        </div>
                        <div className="w-1/2">
                          <label htmlFor="max-value" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Maximum Value
                          </label>
                          <input
                            type="range"
                            id="max-value"
                            min={filterOptions.valueRange.min}
                            max={filterOptions.valueRange.max}
                            value={filters.valueRange[1]}
                            onChange={(e) => {
                              const newMax = parseInt(e.target.value);
                              const newMin = Math.min(filters.valueRange[0], newMax);
                              setFilters(prev => ({ ...prev, valueRange: [newMin, newMax] }));
                              setLastUpdated('value range');
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-rose-500 dark:accent-rose-400"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              valueRange: [filterOptions.valueRange.min, filterOptions.valueRange.max]
                            }));
                            setLastUpdated('reset value range');
                          }}
                          className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Reset Range
                        </button>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              const range = filterOptions.valueRange.max - filterOptions.valueRange.min;
                              const mid = (filterOptions.valueRange.max + filterOptions.valueRange.min) / 2;
                              setFilters(prev => ({
                                ...prev,
                                valueRange: [Math.max(filterOptions.valueRange.min, Math.floor(mid - range / 4)), Math.min(filterOptions.valueRange.max, Math.ceil(mid + range / 4))]
                              }));
                              setLastUpdated('middle range');
                            }}
                            className="text-xs px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-800/50 transition-colors"
                          >
                            Middle Range
                          </button>
                          <button
                            onClick={() => {
                              const upperQuartile = Math.floor(filterOptions.valueRange.min + (filterOptions.valueRange.max - filterOptions.valueRange.min) * 0.75);
                              setFilters(prev => ({
                                ...prev,
                                valueRange: [upperQuartile, filterOptions.valueRange.max]
                              }));
                              setLastUpdated('upper quartile');
                            }}
                            className="text-xs px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-800/50 transition-colors"
                          >
                            Upper Quartile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value Distribution</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-32 flex items-end space-x-1">
                    {/* Value distribution bars - simplified histogram */}
                    {Array.from({ length: 20 }).map((_, i) => {
                      const min = filterOptions.valueRange.min;
                      const max = filterOptions.valueRange.max;
                      const segmentMin = min + ((max - min) / 20) * i;
                      const segmentMax = min + ((max - min) / 20) * (i + 1);
                      const count = data.filter(d => d.value >= segmentMin && d.value < segmentMax).length;
                      const maxCount = Math.max(...Array.from({ length: 20 }).map((_, j) => {
                        const sMin = min + ((max - min) / 20) * j;
                        const sMax = min + ((max - min) / 20) * (j + 1);
                        return data.filter(d => d.value >= sMin && d.value < sMax).length;
                      }));
                      const percentage = maxCount === 0 ? 0 : (count / maxCount) * 100;
                      const inRange = segmentMax >= filters.valueRange[0] && segmentMin <= filters.valueRange[1];
                      
                      return (
                        <div 
                          key={i} 
                          className="w-full relative group cursor-pointer"
                          title={`${segmentMin.toFixed(0)}-${segmentMax.toFixed(0)}: ${count} items`}
                        >
                          <div 
                            className={`w-full rounded-t transition-all ${
                              inRange 
                                ? 'bg-rose-400 dark:bg-rose-500/80 group-hover:bg-rose-500 dark:group-hover:bg-rose-400' 
                                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                            }`} 
                            style={{ height: `${Math.max(percentage, 2)}%` }}
                          ></div>
                          {i % 5 === 0 && (
                            <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
                              {segmentMin.toFixed(0)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer with stats and apply button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {filteredData.length}
            </span> of {data.length} items selected
            {activeFilterCount > 0 && (
              <span className="ml-1">
                using <span className="font-medium text-gray-900 dark:text-gray-100">{activeFilterCount}</span> filters
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              }`}
              disabled={activeFilterCount === 0}
            >
              Reset All Filters
            </button>
            
            <button
              onClick={() => onFilterChange(filteredData)}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelT; 
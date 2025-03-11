import React, { useState } from 'react';

interface DataFiltersProps {
  countries: string[];
  continents: string[];
  climates: string[];
  onCountryChange: (countries: string[]) => void;
  onContinentChange: (continents: string[]) => void;
  onClimateChange: (climates: string[]) => void;
  onValueRangeChange: (min: number, max: number) => void;
}

const DataFilters: React.FC<DataFiltersProps> = ({
  countries,
  continents,
  climates,
  onCountryChange,
  onContinentChange,
  onClimateChange,
  onValueRangeChange
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedClimates, setSelectedClimates] = useState<string[]>([]);
  const [valueRange, setValueRange] = useState<[number, number]>([0, 100]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCountryChange = (country: string) => {
    const newSelection = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    
    setSelectedCountries(newSelection);
    onCountryChange(newSelection);
  };

  const handleContinentChange = (continent: string) => {
    const newSelection = selectedContinents.includes(continent)
      ? selectedContinents.filter(c => c !== continent)
      : [...selectedContinents, continent];
    
    setSelectedContinents(newSelection);
    onContinentChange(newSelection);
  };

  const handleClimateChange = (climate: string) => {
    const newSelection = selectedClimates.includes(climate)
      ? selectedClimates.filter(c => c !== climate)
      : [...selectedClimates, climate];
    
    setSelectedClimates(newSelection);
    onClimateChange(newSelection);
  };

  const handleValueRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value, 10);
    const [min, max] = valueRange;
    
    if (type === 'min') {
      const newMin = Math.min(value, max);
      setValueRange([newMin, max]);
      onValueRangeChange(newMin, max);
    } else {
      const newMax = Math.max(value, min);
      setValueRange([min, newMax]);
      onValueRangeChange(min, newMax);
    }
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedContinents([]);
    setSelectedClimates([]);
    setValueRange([0, 100]);
    onCountryChange([]);
    onContinentChange([]);
    onClimateChange([]);
    onValueRangeChange(0, 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Data Filters</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCountries.length > 0 || selectedContinents.length > 0 || selectedClimates.length > 0 || valueRange[0] > 0 || valueRange[1] < 100
              ? 'Active filters applied'
              : 'Filter data by various criteria'
            }
          </p>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Countries</h3>
              <div className="max-h-40 overflow-y-auto space-y-1 p-2 border border-gray-200 dark:border-gray-700 rounded">
                {countries.map(country => (
                  <label key={country} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryChange(country)}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <span>{country}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Continent Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Continents</h3>
              <div className="space-y-1">
                {continents.map(continent => (
                  <label key={continent} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedContinents.includes(continent)}
                      onChange={() => handleContinentChange(continent)}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <span>{continent}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Climate Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Climate</h3>
              <div className="space-y-1">
                {climates.map(climate => (
                  <label key={climate} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedClimates.includes(climate)}
                      onChange={() => handleClimateChange(climate)}
                      className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <span>{climate}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Value Range Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Min Value: {valueRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={valueRange[0]}
                    onChange={(e) => handleValueRangeChange(e, 'min')}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Max Value: {valueRange[1]}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={valueRange[1]}
                    onChange={(e) => handleValueRangeChange(e, 'max')}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilters; 
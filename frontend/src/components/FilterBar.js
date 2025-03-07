import React, { useState, useEffect } from 'react';

function FilterBar({ setFilter, darkMode }) {
  const [countries, setCountries] = useState([]);
  const [batteryTypes, setBatteryTypes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBatteryType, setSelectedBatteryType] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/filter/countries')
      .then(response => response.json())
      .then(data => setCountries(data.countries || []))
      .catch(error => console.error('Error fetching countries:', error));

    fetch('http://localhost:5000/api/filter/battery-types')
      .then(response => response.json())
      .then(data => setBatteryTypes(data.battery_types || []))
      .catch(error => console.error('Error fetching battery types:', error));
  }, []);

  const handleFilterChange = () => {
    setFilter({
      country: selectedCountry,
      batteryType: selectedBatteryType,
    });
  };

  return (
    <aside className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-card p-6">
      <h2 className="font-display text-heading-3 mb-4 text-primary dark:text-primary">Filters</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-default">Country</label>
          <select 
            value={selectedCountry} 
            onChange={e => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-light dark:bg-gray-800 border-0
              focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-default">Battery Type</label>
          <select 
            value={selectedBatteryType} 
            onChange={e => setSelectedBatteryType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-light dark:bg-gray-800 border-0
              focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value="">Select Battery Type</option>
            {batteryTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleFilterChange}
          className="w-full px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-lg
            transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}

export default FilterBar;

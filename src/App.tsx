import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from './components/layout/MainLayout';
import MapVisualization from './components/map/MapVisualization';
import DataChart from './components/charts/DataChart';
import DataFilters from './components/filters/DataFilters';
import NaturalLanguageSearch from './components/nlp/NaturalLanguageSearch';
import LoadingState from './components/layout/LoadingState';
import useDataLoader from './hooks/useDataLoader';
import useNaturalLanguageQuery from './hooks/useNaturalLanguageQuery';
import useDataAnalysis from './hooks/useDataAnalysis';
import { useToast } from './hooks/useToast';
import { DataPoint } from './services/DataService';

function App() {
  // Load data
  const { data: allData, loading, error, refreshData } = useDataLoader();
  
  // State for filtered data
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  
  // Ref to track if the toast has been shown
  const dataLoadedToastShown = useRef(false);
  
  // Natural language query
  const { processQuery, lastQuery, isProcessing, queryError, clearError } = useNaturalLanguageQuery();
  
  // Data analysis
  const analysis = useDataAnalysis(filteredData);
  
  // Toast notifications
  const { showToast } = useToast();
  
  // Update filtered data when all data changes
  useEffect(() => {
    if (allData && allData.length > 0) {
      setFilteredData(allData);
      
      // Only show toast for successful data load once - moved to a separate effect
      if (!loading && !error) {
        console.log('Data loaded:', allData); // Debug log
      }
    }
  }, [allData, loading, error]);
  
  // Separate effect for toast to prevent it from causing re-renders
  useEffect(() => {
    if (allData && allData.length > 0 && !loading && !error && !dataLoadedToastShown.current) {
      // Use a ref to track if toast has been shown
      const toastMessage = `Loaded ${allData.length} data points`;
      showToast(toastMessage, 'success');
      dataLoadedToastShown.current = true;
    }
  }, [loading, allData, error]); 
  
  // Reset the toast shown flag if we're refreshing data
  useEffect(() => {
    if (loading) {
      dataLoadedToastShown.current = false;
    }
  }, [loading]);
  
  // Show error toast if data loading fails
  useEffect(() => {
    if (error) {
      const errorMessage = `Error loading data: ${error.message}`;
      showToast(errorMessage, 'error');
      console.error('Data loading error:', error);
    }
  }, [error]); // Removed showToast from dependencies

  // Show query error toast
  useEffect(() => {
    if (queryError) {
      showToast(`Query error: ${queryError}`, 'error');
    }
  }, [queryError, showToast]);

  // Debug output for data analysis
  useEffect(() => {
    if (analysis && !loading) {
      console.log('Data analysis:', analysis);
    }
  }, [analysis, loading]);

  // Calculate simple statistics for display
  const getStats = () => {
    if (!allData || allData.length === 0) return null;
    
    return {
      total: allData.length,
      avgValue: Math.round(allData.reduce((sum, item) => sum + item.value, 0) / allData.length),
      countries: [...new Set(allData.map(item => item.country))].length,
      continents: [...new Set(allData.map(item => item.continent))].length,
    };
  };
  
  const stats = getStats();
  
  // Handle natural language search
  const handleSearch = useCallback((query: string) => {
    try {
      clearError();
      const results = processQuery(query, allData);
      setFilteredData(results);
      
      if (results.length === 0) {
        showToast('No results found for your query', 'warning');
      } else {
        showToast(`Found ${results.length} results`, 'success');
      }
    } catch (err) {
      showToast('Error processing your query', 'error');
    }
  }, [allData, processQuery, clearError]); // Removed showToast from dependencies
  
  // Handle country filter change with useMemo for filtered results
  const handleCountryChange = useCallback((countries: string[]) => {
    if (countries.length === 0) {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(point => countries.includes(point.country));
      setFilteredData(filtered);
      showToast(`Filtered to ${filtered.length} data points`, 'info');
    }
  }, [allData]); // Removed showToast from dependencies
  
  // Handle continent filter change with useMemo for filtered results
  const handleContinentChange = useCallback((continents: string[]) => {
    if (continents.length === 0) {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(point => continents.includes(point.continent));
      setFilteredData(filtered);
      showToast(`Filtered to ${filtered.length} data points`, 'info');
    }
  }, [allData]); // Removed showToast from dependencies
  
  // Handle climate filter change
  const handleClimateChange = useCallback((climates: string[]) => {
    if (climates.length === 0) {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(point => climates.includes(point.climate));
      setFilteredData(filtered);
      showToast(`Filtered to ${filtered.length} data points`, 'info');
    }
  }, [allData, showToast]);
  
  // Handle value range filter change
  const handleValueRangeChange = useCallback((min: number, max: number) => {
    const filtered = allData.filter(point => point.value >= min && point.value <= max);
    setFilteredData(filtered);
    showToast(`Filtered to ${filtered.length} data points`, 'info');
  }, [allData, showToast]);
  
  // Get unique countries, continents, and climates from data
  const countries = [...new Set(allData.map(point => point.country))].filter(Boolean);
  const continents = [...new Set(allData.map(point => point.continent))].filter(Boolean);
  const climates = [...new Set(allData.map(point => point.climate))].filter(Boolean);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Visualization Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Interactive analysis of location-based data</p>
            </div>
            <button 
              className="btn-primary"
              onClick={() => {
                refreshData();
                showToast('Refreshing data...', 'info');
              }}
            >
              Refresh Data
            </button>
          </div>
          
          {/* Stats summary */}
          {!loading && !error && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-300">Total Data Points</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-green-800 dark:text-green-300">Average Value</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.avgValue}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="text-sm text-amber-800 dark:text-amber-300">Countries</div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.countries}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-sm text-purple-800 dark:text-purple-300">Continents</div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.continents}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Search panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Search & Filter</h2>
          <NaturalLanguageSearch
            onSearch={handleSearch}
            isProcessing={isProcessing}
            lastQuery={lastQuery || undefined}
          />
          {lastQuery && (
            <div className="mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
              <p>
                <span className="font-medium">Last query:</span> "{lastQuery}"
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {filteredData.length} results
                </span>
              </p>
            </div>
          )}
        </div>
        
        {/* Main content */}
        {loading ? (
          <LoadingState message="Loading data visualization..." />
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p>{error.message}</p>
            <button className="mt-4 btn-primary" onClick={() => refreshData()}>
              Try Again
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p>There are no data points to visualize. Please check your data source.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data charts */}
            <DataChart 
              data={filteredData}
              type="bar"
              loading={loading}
              title="Data by Country"
              description="Bar chart showing distribution by country"
            />
            
            <DataChart 
              data={filteredData}
              type="pie"
              loading={loading}
              title="Continent Distribution"
              description="Distribution of data across continents"
            />
            
            {/* Map visualization */}
            <div className="lg:col-span-2">
              <MapVisualization 
                data={filteredData}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default App; 
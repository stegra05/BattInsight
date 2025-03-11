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
import Card from './components/ui/Card';
import Button from './components/ui/Button';

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
  
  // Extra state for filter options
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [uniqueContinents, setUniqueContinents] = useState<string[]>([]);
  const [uniqueClimates, setUniqueClimates] = useState<string[]>([]);

  // Extract unique values for filters when data loads
  useEffect(() => {
    if (allData && allData.length > 0) {
      setUniqueCountries([...new Set(allData.map(item => item.country))].sort());
      setUniqueContinents([...new Set(allData.map(item => item.continent))].sort());
      setUniqueClimates([...new Set(allData.map(item => item.climate))].sort());
    }
  }, [allData]);
  
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
      // Handle different error types safely
      const errorMessage = typeof queryError === 'string' 
        ? queryError 
        : (queryError as any).message || 'Query error occurred';
      showToast(errorMessage, 'error');
    }
  }, [queryError]);

  // Show analysis complete toast
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
      const filtered = allData.filter(point => point.climate && climates.includes(point.climate));
      setFilteredData(filtered);
      showToast(`Filtered to ${filtered.length} data points`, 'info');
    }
  }, [allData, showToast]);
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header with summary and refresh button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Data Analysis Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Explore and analyze global battery data
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              refreshData();
              showToast('Refreshing data...', 'info');
            }}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            isLoading={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
          
        {/* Stats summary */}
        {!loading && !error && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card 
              className="transform transition-transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4"
              borderless
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Total Data Points</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
                </div>
              </div>
            </Card>
            
            <Card 
              className="transform transition-transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4"
              borderless
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-green-800 dark:text-green-300 font-medium">Average Value</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.avgValue}</div>
                </div>
              </div>
            </Card>
            
            <Card 
              className="transform transition-transform hover:scale-105 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-4"
              borderless
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-200 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-amber-800 dark:text-amber-300 font-medium">Countries</div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.countries}</div>
                </div>
              </div>
            </Card>
            
            <Card 
              className="transform transition-transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4"
              borderless
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">Continents</div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.continents}</div>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Search panel */}
        <Card
          title="Search & Filter"
          subtitle="Use natural language to search and analyze the data"
          className="animate-fade-in"
          contentClassName="p-6"
        >
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
        </Card>
        
        {/* Filter panel */}
        <DataFilters
          countries={uniqueCountries}
          continents={uniqueContinents}
          climates={uniqueClimates}
          onCountryChange={handleCountryChange}
          onContinentChange={handleContinentChange}
          onClimateChange={handleClimateChange}
          onValueRangeChange={(min, max) => {
            const filtered = allData.filter(point => point.value >= min && point.value <= max);
            setFilteredData(filtered);
            showToast(`Filtered to ${filtered.length} data points`, 'info');
          }}
        />
        
        {/* Main content */}
        {loading ? (
          <LoadingState message="Loading data visualization..." />
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-300">Error Loading Data</h3>
              <p className="text-red-600 dark:text-red-400">{error.message}</p>
              <Button 
                variant="primary" 
                className="mt-4" 
                onClick={() => refreshData()}
              >
                Try Again
              </Button>
            </div>
          </Card>
        ) : filteredData.length === 0 ? (
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">No Data Available</h3>
              <p className="text-amber-600 dark:text-amber-400">There are no data points to visualize. Please check your data source.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Data charts */}
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <DataChart 
                data={filteredData}
                type="bar"
                loading={loading}
                title="Data by Country"
                description="Bar chart showing distribution by country"
              />
            </div>
            
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <DataChart 
                data={filteredData}
                type="pie"
                loading={loading}
                title="Continent Distribution"
                description="Distribution of data across continents"
              />
            </div>
            
            {/* Map visualization */}
            <div className="lg:col-span-2 transform transition-all duration-500 hover:scale-[1.01]">
              <Card title="Global Distribution" subtitle="Geographical distribution of data points">
                <MapVisualization 
                  data={filteredData}
                  loading={loading}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default App; 
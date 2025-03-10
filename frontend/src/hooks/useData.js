import React, { useState, useEffect } from 'react';
import ApiClient from '../api/apiClient';

/**
 * Custom hook for data fetching and management
 */
export const useData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const apiClient = new ApiClient();

  // Fetch data with optional filters
  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from API
      const response = await apiClient.getData(filters);
      setData(response.data || []);
      
      // Fetch stats if not already loaded
      if (!stats) {
        const statsResponse = await apiClient.getStats();
        setStats(statsResponse);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    stats,
    fetchData
  };
};

/**
 * Custom hook for API client
 */
export const useApiClient = () => {
  const apiClient = new ApiClient();
  return apiClient;
};

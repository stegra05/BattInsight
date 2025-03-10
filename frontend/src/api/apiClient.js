/* 
Ziel & Funktion:
	•	Abstrahiert alle HTTP-Anfragen an das Flask-Backend.
	•	Bietet Funktionen zum Abrufen von Daten, Senden von Filterparametern und Übermitteln von AI-Abfragen.
Abhängigkeiten:
	•	Wird von den Komponenten DataVisualization.js, Filter.js und AIQuery.js verwendet.
*/

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch battery data with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} - Array of battery data
 */
export const fetchData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await api.get('/data', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * Fetch filter options (countries, continents, climate, etc.)
 * @param {string} filterType - Type of filter options to fetch
 * @returns {Promise<Array>} - Array of filter options
 */
export const fetchFilterOptions = async (filterType) => {
  try {
    const response = await api.get(`/filter/${filterType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${filterType} options:`, error);
    throw error;
  }
};

/**
 * Fetch all filter options at once
 * @returns {Promise<Object>} - Object containing all filter options
 */
export const fetchAllFilterOptions = async () => {
  try {
    const response = await api.get('/filter/options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

/**
 * Send AI query to process natural language into data
 * @param {string} query - Natural language query
 * @returns {Promise<Object>} - Query results
 */
export const sendAIQuery = async (query) => {
  try {
    const response = await api.post('/ai-query', { query });
    return response.data;
  } catch (error) {
    console.error('Error with AI query:', error);
    throw error;
  }
};

/**
 * Fetch statistics about the data
 * @returns {Promise<Object>} - Statistics object
 */
export const fetchStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    return {
      totalRecords: 0,
      avgValue: 0,
      countriesCount: 0,
      modelsCount: 0
    };
  }
};

/**
 * Check the health of the API
 * @returns {Promise<Object>} - Health check response
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/healthcheck');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};
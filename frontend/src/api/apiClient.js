import axios from 'axios';

/**
 * API client for communicating with the backend
 */
class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Data endpoints
  async getData(filters = {}) {
    try {
      const response = await this.client.get('/data', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getStats() {
    try {
      const response = await this.client.get('/stats');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Filter endpoints
  async getFilterOptions() {
    try {
      const response = await this.client.get('/filter/options');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEnhancedFilterOptions() {
    try {
      const response = await this.client.get('/filter/enhanced-options');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async applyFilters(filters) {
    try {
      const response = await this.client.get('/filter/apply', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async applyEnhancedFilters(filters, pagination, sort) {
    try {
      const response = await this.client.post('/filter/apply-enhanced', {
        filters,
        pagination,
        sort,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // AI Query endpoints
  async submitAiQuery(query, options = {}) {
    try {
      const response = await this.client.post('/ai-query', {
        query,
        options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Export endpoints
  async exportCsv(filters = {}) {
    try {
      // Use window.location for direct download
      const queryParams = new URLSearchParams(filters).toString();
      return `${this.baseURL}/export/csv?${queryParams}`;
    } catch (error) {
      this.handleError(error);
    }
  }

  async exportJson(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return `${this.baseURL}/export/json?${queryParams}`;
    } catch (error) {
      this.handleError(error);
    }
  }

  async exportExcel(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return `${this.baseURL}/export/excel?${queryParams}`;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Mapbox endpoints
  async getCountryData(filters = {}) {
    try {
      const response = await this.client.get('/mapbox/country-data', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMapboxConfig() {
    try {
      const response = await this.client.get('/mapbox/config');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(error.response.data.error || 'An error occurred with the API');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
      throw new Error('Error setting up request');
    }
  }
}

export default ApiClient;

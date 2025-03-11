import { useState, useCallback } from 'react';
import { DataPoint } from '../services/DataService';

interface NaturalLanguageQueryResult {
  processQuery: (query: string, data: DataPoint[]) => DataPoint[];
  lastQuery: string | null;
  isProcessing: boolean;
  queryError: string | null;
  clearError: () => void;
}

// This is a basic NLP implementation - in a real app this would use more sophisticated techniques
const useNaturalLanguageQuery = (): NaturalLanguageQueryResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setQueryError(null);
  }, []);

  // Helper function to extract numerical values from queries
  const extractNumber = (query: string, pattern: RegExp): number | null => {
    const match = query.match(pattern);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      return isNaN(value) ? null : value;
    }
    return null;
  };

  // Helper function for date extraction
  const extractDate = (query: string): { startDate: Date | null, endDate: Date | null } => {
    const result = { startDate: null as Date | null, endDate: null as Date | null };
    
    // Before date pattern (e.g., "before 2022" or "before January 2022")
    const beforeMatch = query.match(/before\s+([a-z]+\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}|\d{4})/i);
    if (beforeMatch && beforeMatch[1]) {
      try {
        const date = new Date(beforeMatch[1]);
        if (!isNaN(date.getTime())) { // Check if date is valid
          result.endDate = date;
        }
      } catch (e) {
        console.error("Failed to parse 'before' date", e);
      }
    }
    
    // After date pattern (e.g., "after 2020" or "after December 2020")
    const afterMatch = query.match(/after\s+([a-z]+\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}|\d{4})/i);
    if (afterMatch && afterMatch[1]) {
      try {
        const date = new Date(afterMatch[1]);
        if (!isNaN(date.getTime())) { // Check if date is valid
          result.startDate = date;
        }
      } catch (e) {
        console.error("Failed to parse 'after' date", e);
      }
    }
    
    // Between dates pattern (e.g., "between 2020 and 2022")
    const betweenMatch = query.match(/between\s+([a-z]+\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}|\d{4})\s+and\s+([a-z]+\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}|\d{4})/i);
    if (betweenMatch && betweenMatch[1] && betweenMatch[3]) {
      try {
        const startDate = new Date(betweenMatch[1]);
        const endDate = new Date(betweenMatch[3]);
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) { // Check if dates are valid
          result.startDate = startDate;
          result.endDate = endDate;
        }
      } catch (e) {
        console.error("Failed to parse 'between' dates", e);
      }
    }
    
    return result;
  };

  const processQuery = useCallback((query: string, data: DataPoint[]): DataPoint[] => {
    setIsProcessing(true);
    setLastQuery(query);
    
    try {
      // Convert query to lowercase for easier matching
      const lowerQuery = query.toLowerCase();
      
      // Simple natural language processing logic
      // This is a basic implementation - in a real app, you might use a more sophisticated NLP library
      
      // Filter by value
      if (lowerQuery.includes('greater than') || lowerQuery.includes('more than')) {
        const valueMatch = lowerQuery.match(/(?:greater|more) than (\d+)/);
        if (valueMatch && valueMatch[1]) {
          const threshold = parseInt(valueMatch[1], 10);
          setIsProcessing(false);
          return data.filter(point => point.value > threshold);
        }
      }
      
      if (lowerQuery.includes('less than')) {
        const valueMatch = lowerQuery.match(/less than (\d+)/);
        if (valueMatch && valueMatch[1]) {
          const threshold = parseInt(valueMatch[1], 10);
          setIsProcessing(false);
          return data.filter(point => point.value < threshold);
        }
      }
      
      // Filter by continent
      const continents = ['europe', 'asia', 'north america', 'south america', 'africa', 'oceania', 'antarctica'];
      for (const continent of continents) {
        if (lowerQuery.includes(continent)) {
          setIsProcessing(false);
          return data.filter(point => 
            point.continent.toLowerCase() === continent
          );
        }
      }
      
      // Filter by climate
      const climates = ['temperate', 'tropical', 'arid', 'continental', 'polar'];
      for (const climate of climates) {
        if (lowerQuery.includes(climate)) {
          setIsProcessing(false);
          return data.filter(point => 
            point.climate.toLowerCase() === climate
          );
        }
      }
      
      // Filter by country
      // This is a simplified approach - a real implementation would need a more robust way to identify countries
      const countries = [...new Set(data.map(point => point.country.toLowerCase()))];
      for (const country of countries) {
        if (lowerQuery.includes(country)) {
          setIsProcessing(false);
          return data.filter(point => 
            point.country.toLowerCase() === country
          );
        }
      }
      
      // Compare/show all data
      if (lowerQuery.includes('compare') || lowerQuery.includes('show all')) {
        setIsProcessing(false);
        return data;
      }
      
      // If no specific filter was matched, return all data
      setIsProcessing(false);
      return data;
      
    } catch (error) {
      console.error('Error processing natural language query:', error);
      setQueryError('Failed to process your query. Please try again with different wording.');
      setIsProcessing(false);
      return data;
    }
  }, []);

  return {
    processQuery,
    lastQuery,
    isProcessing,
    queryError,
    clearError
  };
};

export default useNaturalLanguageQuery; 
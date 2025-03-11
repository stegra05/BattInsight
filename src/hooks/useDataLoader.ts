import { useState, useEffect } from 'react';
import { fetchData, DataPoint } from '../services/DataService';

interface DataLoaderResult {
  data: DataPoint[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

// Custom hook to load data from the data service
const useDataLoader = (): DataLoaderResult => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading data'));
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to manually refresh data
  const refreshData = async () => {
    await loadData();
  };

  return { data, loading, error, refreshData };
};

export default useDataLoader; 
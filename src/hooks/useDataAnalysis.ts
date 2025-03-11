import { useMemo } from 'react';
import { DataPoint } from '../services/DataService';

interface AnalysisResult {
  averageValue: number;
  minValue: number;
  maxValue: number;
  valueDistribution: Record<string, number>;
  continentDistribution: Record<string, number>;
  climateDistribution: Record<string, number>;
}

// Custom hook to analyze data points
const useDataAnalysis = (data: DataPoint[]): AnalysisResult => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        averageValue: 0,
        minValue: 0,
        maxValue: 0,
        valueDistribution: {},
        continentDistribution: {},
        climateDistribution: {}
      };
    }

    // Calculate basic stats
    const values = data.map(point => point.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const averageValue = sum / values.length;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Value distribution (in ranges of 10)
    const valueDistribution: Record<string, number> = {};
    values.forEach(value => {
      const range = Math.floor(value / 10) * 10;
      const rangeLabel = `${range}-${range + 9}`;
      valueDistribution[rangeLabel] = (valueDistribution[rangeLabel] || 0) + 1;
    });

    // Continent distribution
    const continentDistribution: Record<string, number> = {};
    data.forEach(point => {
      if (point.continent) {
        continentDistribution[point.continent] = (continentDistribution[point.continent] || 0) + 1;
      }
    });

    // Climate distribution
    const climateDistribution: Record<string, number> = {};
    data.forEach(point => {
      if (point.climate) {
        climateDistribution[point.climate] = (climateDistribution[point.climate] || 0) + 1;
      }
    });

    return {
      averageValue,
      minValue,
      maxValue,
      valueDistribution,
      continentDistribution,
      climateDistribution
    };
  }, [data]);
};

export default useDataAnalysis; 
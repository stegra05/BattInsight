// DataService.ts
// This service handles data fetching and processing

export interface DataPoint {
  id: string;
  lat: number;
  lng: number;
  country: string;
  continent: string;
  climate: string;
  value: number;
  timestamp: string;
  // Add any other properties referenced in your app
}

// Mock data function - replace with actual API call when ready
export const fetchData = async (): Promise<DataPoint[]> => {
  try {
    // For development, use mock data
    // In production, replace with: const response = await fetch('/api/data');
    return mockData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Sample mock data
const mockData: DataPoint[] = [
  {
    id: '1',
    lat: 52.5200,
    lng: 13.4050,
    country: 'Germany',
    continent: 'Europe',
    climate: 'Temperate',
    value: 85,
    timestamp: '2023-01-15T12:30:45Z'
  },
  {
    id: '2',
    lat: 40.7128,
    lng: -74.0060,
    country: 'United States',
    continent: 'North America',
    climate: 'Continental',
    value: 92,
    timestamp: '2023-01-16T08:15:30Z'
  },
  {
    id: '3',
    lat: 35.6762,
    lng: 139.6503,
    country: 'Japan',
    continent: 'Asia',
    climate: 'Temperate',
    value: 78,
    timestamp: '2023-01-14T22:45:10Z'
  },
  {
    id: '4',
    lat: -33.8688,
    lng: 151.2093,
    country: 'Australia',
    continent: 'Oceania',
    climate: 'Arid',
    value: 65,
    timestamp: '2023-01-17T03:20:55Z'
  },
  {
    id: '5',
    lat: -23.5505,
    lng: -46.6333,
    country: 'Brazil',
    continent: 'South America',
    climate: 'Tropical',
    value: 71,
    timestamp: '2023-01-18T14:10:25Z'
  }
]; 
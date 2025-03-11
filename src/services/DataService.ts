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
  },
  {
    id: '6',
    lat: 51.5074,
    lng: -0.1278,
    country: 'United Kingdom',
    continent: 'Europe',
    climate: 'Maritime',
    value: 79,
    timestamp: '2023-01-19T09:45:15Z'
  },
  {
    id: '7',
    lat: 55.7558,
    lng: 37.6173,
    country: 'Russia',
    continent: 'Europe',
    climate: 'Continental',
    value: 58,
    timestamp: '2023-01-20T17:30:40Z'
  },
  {
    id: '8',
    lat: 30.0444,
    lng: 31.2357,
    country: 'Egypt',
    continent: 'Africa',
    climate: 'Desert',
    value: 44,
    timestamp: '2023-01-21T11:20:35Z'
  },
  {
    id: '9',
    lat: 28.6139,
    lng: 77.2090,
    country: 'India',
    continent: 'Asia',
    climate: 'Tropical',
    value: 67,
    timestamp: '2023-01-22T13:15:50Z'
  },
  {
    id: '10',
    lat: 39.9042,
    lng: 116.4074,
    country: 'China',
    continent: 'Asia',
    climate: 'Continental',
    value: 73,
    timestamp: '2023-01-23T16:40:20Z'
  },
  {
    id: '11',
    lat: -8.4095,
    lng: 115.1889,
    country: 'Indonesia',
    continent: 'Asia',
    climate: 'Tropical',
    value: 62,
    timestamp: '2023-01-24T07:55:30Z'
  },
  {
    id: '12',
    lat: 48.8566,
    lng: 2.3522,
    country: 'France',
    continent: 'Europe',
    climate: 'Temperate',
    value: 81,
    timestamp: '2023-01-25T14:25:45Z'
  },
  {
    id: '13',
    lat: 41.9028,
    lng: 12.4964,
    country: 'Italy',
    continent: 'Europe',
    climate: 'Mediterranean',
    value: 87,
    timestamp: '2023-01-26T10:35:10Z'
  },
  {
    id: '14',
    lat: -1.2921,
    lng: 36.8219,
    country: 'Kenya',
    continent: 'Africa',
    climate: 'Tropical',
    value: 55,
    timestamp: '2023-01-27T18:05:25Z'
  },
  {
    id: '15',
    lat: 9.0820,
    lng: 8.6753,
    country: 'Nigeria',
    continent: 'Africa',
    climate: 'Tropical',
    value: 49,
    timestamp: '2023-01-28T08:50:15Z'
  }
]; 
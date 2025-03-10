import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Select,
  Button,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApiClient } from '../../hooks/useApiClient';
import Loading from '../common/Loading';

/**
 * DataVisualization component for visualizing battery data
 */
const DataVisualization = ({ data, filters, isAiQueryResult = false, sqlQuery = null }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapConfig, setMapConfig] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const apiClient = useApiClient();
  const bgColor = useColorModeValue('white', 'gray.700');

  // Initialize map configuration
  useEffect(() => {
    const fetchMapConfig = async () => {
      try {
        const config = await apiClient.getMapboxConfig();
        setMapConfig(config);
      } catch (err) {
        console.error('Error fetching map configuration:', err);
        setError('Failed to load map configuration');
      }
    };

    fetchMapConfig();
  }, [apiClient]);

  // Process data for visualization
  useEffect(() => {
    if (!data || data.length === 0) return;

    try {
      // Process data for charts
      processChartData(data);

      // Process data for map
      if (!isAiQueryResult) {
        fetchMapData();
      }
    } catch (err) {
      console.error('Error processing data:', err);
      setError('Failed to process data for visualization');
    }
  }, [data, filters, isAiQueryResult]);

  // Initialize map when map data and config are available
  useEffect(() => {
    if (!mapData || !mapConfig || !mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = mapConfig.access_token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapConfig.style,
        center: mapConfig.default_center,
        zoom: mapConfig.default_zoom
      });

      map.current.on('load', () => {
        addMapLayers();
      });

      // Cleanup function to remove map when component unmounts
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [mapData, mapConfig]);

  // Process data for charts
  const processChartData = (data) => {
    // Group data by relevant dimensions
    const groupedByCountry = groupDataBy(data, 'country', 'val');
    const groupedByClimate = groupDataBy(data, 'climate', 'val');
    const groupedByModelSeries = groupDataBy(data, 'model_series', 'val');

    // Create chart datasets
    const chartData = {
      bar: {
        labels: Object.keys(groupedByCountry),
        datasets: [{
          label: 'Average Value by Country',
          data: Object.values(groupedByCountry),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      line: {
        labels: Object.keys(groupedByModelSeries),
        datasets: [{
          label: 'Average Value by Model Series',
          data: Object.values(groupedByModelSeries),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      scatter: {
        datasets: [{
          label: 'Value vs Vehicle Count',
          data: data.map(item => ({
            x: item.val,
            y: item.cnt_vhcl
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      }
    };

    setChartData(chartData);
  };

  // Fetch map data from API
  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCountryData(filters);
      setMapData(response.country_data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError('Failed to load map data');
      setLoading(false);
    }
  };

  // Add layers to map
  const addMapLayers = () => {
    if (!map.current || !mapData) return;

    // Check if source already exists and remove it
    if (map.current.getSource('countries')) {
      map.current.removeLayer('countries-layer');
      map.current.removeSource('countries');
    }

    // Create GeoJSON data
    const geojsonData = {
      type: 'FeatureCollection',
      features: Object.values(mapData).map(country => ({
        type: 'Feature',
        properties: {
          country: country.country,
          value: country.average,
          count: country.count
        },
        geometry: {
          type: 'Point',
          coordinates: [country.coordinates.lng, country.coordinates.lat]
        }
      }))
    };

    // Add source and layer
    map.current.addSource('countries', {
      type: 'geojson',
      data: geojsonData
    });

    map.current.addLayer({
      id: 'countries-layer',
      type: 'circle',
      source: 'countries',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'count'],
          0, 5,
          100, 15,
          1000, 25
        ],
        'circle-color': [
          'interpolate', ['linear'], ['get', 'value'],
          0, '#66c2a5',
          50, '#fc8d62',
          100, '#8da0cb'
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    // Add popups
    map.current.on('click', 'countries-layer', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { country, value, count } = e.features[0].properties;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <strong>${country}</strong><br/>
          Average Value: ${parseFloat(value).toFixed(2)}<br/>
          Data Points: ${count}
        `)
        .addTo(map.current);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'countries-layer', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'countries-layer', () => {
      map.current.getCanvas().style.cursor = '';
    });
  };

  // Helper function to group data by a dimension
  const groupDataBy = (data, dimension, valueField) => {
    const grouped = {};
    
    data.forEach(item => {
      const key = item[dimension];
      if (!key) return;
      
      if (!grouped[key]) {
        grouped[key] = {
          sum: 0,
          count: 0
        };
      }
      
      grouped[key].sum += parseFloat(item[valueField]) || 0;
      grouped[key].count += 1;
    });
    
    // Calculate averages
    const result = {};
    Object.keys(grouped).forEach(key => {
      result[key] = grouped[key].sum / grouped[key].count;
    });
    
    return result;
  };

  // Chart options
  const chartOptions = {
    bar: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Average Value by Country'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    line: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Average Value by Model Series'
        }
      }
    },
    scatter: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Value vs Vehicle Count'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Value'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Vehicle Count'
          }
        }
      }
    }
  };

  // If data is from AI query, show SQL query
  const renderSqlQuery = () => {
    if (!sqlQuery) return null;
    
    return (
      <Box 
        p={4} 
        bg="gray.50" 
        borderRadius="md" 
        fontFamily="mono" 
        fontSize="sm"
        overflowX="auto"
        mb={6}
      >
        <Text fontWeight="bold" mb={2}>Generated SQL Query:</Text>
        <pre>{sqlQuery}</pre>
      </Box>
    );
  };

  // Render loading state
  if (loading) {
    return <Loading text="Loading visualization data..." />;
  }

  // Render error state
  if (error) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="md">
        <Text fontWeight="bold">Error:</Text>
        <Text>{error}</Text>
      </Box>
    );
  }

  // Render no data state
  if (!data || data.length === 0) {
    return (
      <Box p={4} bg="blue.50" color="blue.500" borderRadius="md">
        <Text fontWeight="bold">No Data Available</Text>
        <Text>Try adjusting your filters or query to see visualization.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* SQL Query (if from AI query) */}
      {renderSqlQuery()}
      
      {/* Data Summary */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
        <Stat
          px={4}
          py={3}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Total Records</StatLabel>
          <StatNumber>{data.length.toLocaleString()}</StatNumber>
          <StatHelpText>Data points</StatHelpText>
        </Stat>
        <Stat
          px={4}
          py={3}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Average Value</StatLabel>
          <StatNumber>
            {(data.reduce((sum, item) => sum + (parseFloat(item.val) || 0), 0) / data.length).toFixed(2)}
          </StatNumber>
          <StatHelpText>Across all records</StatHelpText>
        </Stat>
        <Stat
          px={4}
          py={3}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Unique Countries</StatLabel>
          <StatNumber>
            {new Set(data.map(item => item.country).filter(Boolean)).size}
          </StatNumber>
          <StatHelpText>Geographic coverage</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Visualization Tabs */}
      <Tabs 
        isFitted 
        variant="enclosed" 
        colorScheme="blue" 
        onChange={(index) => setActiveTab(index)}
        mb={6}
      >
        <TabList>
          <Tab>Map View</Tab>
          <Tab>Bar Chart</Tab>
          <Tab>Line Chart</Tab>
          <Tab>Scatter Plot</Tab>
        </TabList>
        <TabPanels>
          {/* Map View */}
          <TabPanel>
            <Box 
              ref={mapContainer} 
              height="500px" 
              width="100%" 
              borderRadius="md"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            />
            {!mapData && (
              <Text mt={2} fontSize="sm" color="gray.500">
                Map data is only available for geographic queries. Try filtering by country or continent.
              </Text>
            )}
          </TabPanel>
          
          {/* Bar Chart */}
          <TabPanel>
            {chartData && (
              <Box height="500px" width="100%">
                <Bar data={chartData.bar} options={chartOptions.bar} />
              </Box>
            )}
          </TabPanel>
          
          {/* Line Chart */}
          <TabPanel>
            {chartData && (
              <Box height="500px" width="100%">
                <Line data={chartData.line} options={chartOptions.line} />
              </Box>
            )}
          </TabPanel>
          
          {/* Scatter Plot */}
          <TabPanel>
            {chartData && (
              <Box height="500px" width="100%">
                <Scatter data={chartData.scatter} options={chartOptions.scatter} />
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Data Table Preview */}
      <Box
        overflowX="auto"
        bg={bgColor}
        borderRadius="lg"
        boxShadow="sm"
        p={4}
      >
        <Heading as="h3" size="md" mb={4}>
          Data Preview
        </Heading>
        <Box as="table" width="100%" style={{ borderCollapse: 'collapse' }}>
          <Box as="thead" bg={useColorModeValue('gray.50', 'gray.700')}>
            <Box as="tr">
              <Box as="th" p={2} textAlign="left">ID</Box>
              <Box as="th" p={2} textAlign="left">Battery</Box>
              <Box as="th" p={2} textAlign="left">Country</Box>
              <Box as="th" p={2} textAlign="left">Climate</Box>
              <Box as="th" p={2} textAlign="left">Model Series</Box>
              <Box as="th" p={2} textAlign="left">Variable</Box>
              <Box as="th" p={2} textAlign="left">Value</Box>
              <Box as="th" p={2} textAlign="left">Vehicle Count</Box>
            </Box>
          </Box>
          <Box as="tbody">
            {data.slice(0, 10).map((item, index) => (
              <Box 
                as="tr" 
                key={index}
                _odd={{ bg: useColorModeValue('gray.50', 'gray.700') }}
              >
                <Box as="td" p={2}>{item.id}</Box>
                <Box as="td" p={2}>{item.batt_alias}</Box>
                <Box as="td" p={2}>{item.country}</Box>
                <Box as="td" p={2}>{item.climate}</Box>
                <Box as="td" p={2}>{item.model_series}</Box>
                <Box as="td" p={2}>{item.var}</Box>
                <Box as="td" p={2}>{parseFloat(item.val).toFixed(2)}</Box>
                <Box as="td" p={2}>{item.cnt_vhcl}</Box>
              </Box>
            ))}
          </Box>
        </Box>
        {data.length > 10 && (
          <Text mt={2} fontSize="sm" color="gray.500">
            Showing 10 of {data.length} records
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default DataVisualization;

/* 
Ziel & Funktion:
	•	Zeigt die Daten visuell an – zunächst als Tabelle, später als interaktive Weltkarte mit Mapbox GL JS.
Abhängigkeiten:
	•	Erhält Daten als Props, die über den API-Client (in apiClient.js) bereitgestellt werden.
	•	Wird von HomePage.js eingebunden.
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  useColorModeValue,
  Button,
  Flex,
  Badge,
  Heading,
} from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Note: In a production app, you should use environment variables for the token
// This is just for demonstration purposes
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';

const DataVisualization = ({ data, isLoading, error }) => {
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'table'
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom] = useState(1.5);
  
  // Process data for mapping
  useEffect(() => {
    if (viewMode !== 'map' || isLoading || !data || data.length === 0) return;
    
    // Initialize map if it doesn't exist
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [0, 30],
        zoom: zoom
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Group data by country to determine color intensity
    const countryData = data.reduce((acc, item) => {
      if (!item.country || !item.iso_a3) return acc;
      
      if (!acc[item.iso_a3]) {
        acc[item.iso_a3] = {
          country: item.country,
          iso_a3: item.iso_a3,
          total: 0,
          count: 0,
          values: []
        };
      }
      
      acc[item.iso_a3].total += parseFloat(item.val) || 0;
      acc[item.iso_a3].count += 1;
      acc[item.iso_a3].values.push(parseFloat(item.val) || 0);
      
      return acc;
    }, {});

    // Calculate average for each country
    Object.values(countryData).forEach(country => {
      country.average = country.total / country.count;
    });

    // Find min and max for color scaling
    const values = Object.values(countryData).map(c => c.average);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Add data source and layer to map once it's loaded
    map.current.on('load', () => {
      // Add source if it doesn't exist
      if (!map.current.getSource('countries')) {
        map.current.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });
      }

      // Add layer if it doesn't exist
      if (!map.current.getLayer('country-fills')) {
        map.current.addLayer({
          id: 'country-fills',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', ['to-string', ['get', 'iso_3166_1_alpha_3']], ['literal', countryData]],
              minValue,
              '#e6f2ff',
              (minValue + maxValue) / 2,
              '#66b3ff',
              maxValue,
              '#0066cc'
            ],
            'fill-opacity': 0.75
          }
        });

        // Add hover effect
        map.current.addLayer({
          id: 'country-borders',
          type: 'line',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'line-color': '#627BC1',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              0.5
            ]
          }
        });
      }

      // Add popups on click
      map.current.on('click', 'country-fills', (e) => {
        if (e.features.length === 0) return;
        
        const countryCode = e.features[0].properties.iso_3166_1_alpha_3;
        const countryInfo = countryData[countryCode];
        
        if (!countryInfo) return;
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${countryInfo.country}</strong><br/>
            Average Value: ${countryInfo.average.toFixed(2)}<br/>
            Data Points: ${countryInfo.count}
          `)
          .addTo(map.current);
      });
    });
    
    // Update map expressions if the map is already initialized
    if (map.current.loaded() && map.current.getLayer('country-fills')) {
      map.current.setPaintProperty('country-fills', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', ['to-string', ['get', 'iso_3166_1_alpha_3']], ['literal', countryData]],
        minValue,
        '#e6f2ff',
        (minValue + maxValue) / 2,
        '#66b3ff',
        maxValue,
        '#0066cc'
      ]);
    }
    
    // Cleanup function
    return () => {
      if (map.current) {
        // map.current.remove();
      }
    };
  }, [data, viewMode, isLoading, zoom]);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
        bg={bgColor}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Box>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }
  
  // If no data, show message
  if (!data || data.length === 0) {
    return (
      <Box
        p={5}
        bg={bgColor}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <Text fontSize="lg">No data available for the selected filters.</Text>
        <Button mt={4} colorScheme="blue" size="sm">
          Reset Filters
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">
          Data Visualization
          <Badge ml={2} colorScheme="blue">
            {data.length} records
          </Badge>
        </Heading>
        
        <Flex>
          <Button
            mr={2}
            colorScheme={viewMode === 'map' ? 'blue' : 'gray'}
            onClick={() => setViewMode('map')}
            size="sm"
          >
            Map View
          </Button>
          <Button
            colorScheme={viewMode === 'table' ? 'blue' : 'gray'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Table View
          </Button>
        </Flex>
      </Flex>
      
      {viewMode === 'map' ? (
        <Box
          ref={mapContainer}
          h="600px"
          borderRadius="md"
          overflow="hidden"
          borderWidth="1px"
          borderColor={borderColor}
        />
      ) : (
        <Box
          overflowX="auto"
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Alias</Th>
                <Th>Country</Th>
                <Th>Continent</Th>
                <Th>Climate</Th>
                <Th isNumeric>Value</Th>
                <Th>Variable</Th>
                <Th>Model Series</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.slice(0, 100).map((item, index) => (
                <Tr key={index}>
                  <Td>{item.batt_alias}</Td>
                  <Td>{item.country}</Td>
                  <Td>{item.continent}</Td>
                  <Td>{item.climate}</Td>
                  <Td isNumeric>{parseFloat(item.val).toFixed(2)}</Td>
                  <Td>{item.var}</Td>
                  <Td>{item.model_series_id}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          {data.length > 100 && (
            <Box p={4} textAlign="center">
              <Text color="gray.500">
                Showing 100 of {data.length} records. Use filters to narrow down results.
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DataVisualization;
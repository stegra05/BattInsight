import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Flex,
  Text,
  Button,
  Stack,
  Divider,
  Checkbox,
  CheckboxGroup,
  useColorModeValue,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient';
import Loading from '../common/Loading';

/**
 * Filter component for filtering battery data
 */
const Filter = ({ onFilterChange }) => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    continents: [],
    countries: [],
    climates: [],
    model_series: [],
    variables: [],
    value_range: { min: 0, max: 100 },
    vehicle_count_range: { min: 0, max: 1000 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useApiClient();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const options = await apiClient.getEnhancedFilterOptions();
        setFilterOptions(options);
        
        // Initialize value ranges from API data
        if (options.value_ranges) {
          setSelectedFilters(prev => ({
            ...prev,
            value_range: {
              min: options.value_ranges.min,
              max: options.value_ranges.max
            }
          }));
        }
        
        if (options.vehicle_count_ranges) {
          setSelectedFilters(prev => ({
            ...prev,
            vehicle_count_range: {
              min: options.vehicle_count_ranges.min,
              max: options.vehicle_count_ranges.max
            }
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setError('Failed to load filter options');
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, [apiClient]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle checkbox selection for multi-select filters
  const handleCheckboxChange = (filterType, value, isChecked) => {
    setSelectedFilters(prev => {
      const currentValues = [...prev[filterType]];
      
      if (isChecked) {
        // Add value if it's not already in the array
        if (!currentValues.includes(value)) {
          currentValues.push(value);
        }
      } else {
        // Remove value if it's in the array
        const index = currentValues.indexOf(value);
        if (index !== -1) {
          currentValues.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [filterType]: currentValues
      };
    });
  };

  // Handle range slider changes
  const handleRangeChange = (filterType, values) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: {
        min: values[0],
        max: values[1]
      }
    }));
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedFilters({
      continents: [],
      countries: [],
      climates: [],
      model_series: [],
      variables: [],
      value_range: filterOptions?.value_ranges ? {
        min: filterOptions.value_ranges.min,
        max: filterOptions.value_ranges.max
      } : { min: 0, max: 100 },
      vehicle_count_range: filterOptions?.vehicle_count_ranges ? {
        min: filterOptions.vehicle_count_ranges.min,
        max: filterOptions.vehicle_count_ranges.max
      } : { min: 0, max: 1000 }
    });
    
    // Apply reset filters
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // Render loading state
  if (loading) {
    return <Loading text="Loading filter options..." />;
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

  // Render no options state
  if (!filterOptions) {
    return (
      <Box p={4} bg="blue.50" color="blue.500" borderRadius="md">
        <Text fontWeight="bold">No Filter Options Available</Text>
        <Text>Unable to load filter options. Please try again later.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Accordion defaultIndex={[0, 1]} allowMultiple>
        {/* Geographic Filters */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={2}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Geographic Filters
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {/* Continents */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Continents</FormLabel>
              <Box maxH="150px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                <CheckboxGroup colorScheme="blue">
                  <Stack spacing={1}>
                    {filterOptions.continents?.map(continent => (
                      <Checkbox
                        key={continent.name}
                        isChecked={selectedFilters.continents.includes(continent.name)}
                        onChange={(e) => handleCheckboxChange('continents', continent.name, e.target.checked)}
                      >
                        <Flex justify="space-between" width="100%">
                          <Text>{continent.name}</Text>
                          <Badge colorScheme="blue" ml={2}>
                            {continent.country_count} countries
                          </Badge>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            {/* Countries */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Countries</FormLabel>
              <Box maxH="150px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                <CheckboxGroup colorScheme="blue">
                  <Stack spacing={1}>
                    {filterOptions.countries?.map(country => (
                      <Checkbox
                        key={country.name}
                        isChecked={selectedFilters.countries.includes(country.name)}
                        onChange={(e) => handleCheckboxChange('countries', country.name, e.target.checked)}
                        isDisabled={selectedFilters.continents.length > 0 && !selectedFilters.continents.includes(country.continent)}
                      >
                        <Flex justify="space-between" width="100%">
                          <Text>{country.name}</Text>
                          <Badge colorScheme="green" ml={2}>
                            {country.record_count} records
                          </Badge>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            {/* Climates */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Climate Types</FormLabel>
              <Box maxH="150px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                <CheckboxGroup colorScheme="blue">
                  <Stack spacing={1}>
                    {filterOptions.climates?.map(climate => (
                      <Checkbox
                        key={climate.name}
                        isChecked={selectedFilters.climates.includes(climate.name)}
                        onChange={(e) => handleCheckboxChange('climates', climate.name, e.target.checked)}
                      >
                        <Flex justify="space-between" width="100%">
                          <Text>{climate.name}</Text>
                          <Badge colorScheme="purple" ml={2}>
                            {climate.country_count} countries
                          </Badge>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>
          </AccordionPanel>
        </AccordionItem>

        {/* Battery Filters */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={2}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Battery Filters
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {/* Model Series */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Model Series</FormLabel>
              <Box maxH="150px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                <CheckboxGroup colorScheme="blue">
                  <Stack spacing={1}>
                    {filterOptions.model_series?.map(series => (
                      <Checkbox
                        key={series.id}
                        isChecked={selectedFilters.model_series.includes(series.id)}
                        onChange={(e) => handleCheckboxChange('model_series', series.id, e.target.checked)}
                      >
                        <Flex justify="space-between" width="100%">
                          <Text>{series.series_name}</Text>
                          <Badge colorScheme="orange" ml={2}>
                            {series.battery_count} batteries
                          </Badge>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            {/* Variables */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Variables</FormLabel>
              <Box maxH="150px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                <CheckboxGroup colorScheme="blue">
                  <Stack spacing={1}>
                    {filterOptions.variables?.map(variable => (
                      <Checkbox
                        key={variable.name}
                        isChecked={selectedFilters.variables.includes(variable.name)}
                        onChange={(e) => handleCheckboxChange('variables', variable.name, e.target.checked)}
                      >
                        <Flex justify="space-between" width="100%">
                          <Text>{variable.name}</Text>
                          <Badge colorScheme="teal" ml={2}>
                            {variable.record_count} records
                          </Badge>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>
            </FormControl>

            {/* Value Range */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Value Range</FormLabel>
              <RangeSlider
                aria-label={['min', 'max']}
                defaultValue={[
                  filterOptions.value_ranges?.min || 0,
                  filterOptions.value_ranges?.max || 100
                ]}
                min={filterOptions.value_ranges?.min || 0}
                max={filterOptions.value_ranges?.max || 100}
                step={0.1}
                onChange={(values) => handleRangeChange('value_range', values)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm">{selectedFilters.value_range.min.toFixed(1)}</Text>
                <Text fontSize="sm">{selectedFilters.value_range.max.toFixed(1)}</Text>
              </Flex>
            </FormControl>

            {/* Vehicle Count Range */}
            <FormControl mb={4}>
              <FormLabel fontWeight="medium">Vehicle Count Range</FormLabel>
              <RangeSlider
                aria-label={['min', 'max']}
                defaultValue={[
                  filterOptions.vehicle_count_ranges?.min || 0,
                  filterOptions.vehicle_count_ranges?.max || 1000
                ]}
                min={filterOptions.vehicle_count_ranges?.min || 0}
                max={filterOptions.vehicle_count_ranges?.max || 1000}
                step={1}
                onChange={(values) => handleRangeChange('vehicle_count_range', values)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm">{selectedFilters.vehicle_count_range.min}</Text>
                <Text fontSize="sm">{selectedFilters.vehicle_count_range.max}</Text>
              </Flex>
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Filter Actions */}
      <Divider my={4} />
      <Flex justify="space-between">
        <Button
          colorScheme="gray"
          size="sm"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </Flex>

      {/* Active Filters Summary */}
      <Box mt={4}>
        <Text fontSize="sm" fontWeight="medium" mb={2}>Active Filters:</Text>
        <Flex wrap="wrap" gap={2}>
          {selectedFilters.continents.length > 0 && (
            <Badge colorScheme="blue" p={1}>
              {selectedFilters.continents.length} Continents
            </Badge>
          )}
          {selectedFilters.countries.length > 0 && (
            <Badge colorScheme="green" p={1}>
              {selectedFilters.countries.length} Countries
            </Badge>
          )}
          {selectedFilters.climates.length > 0 && (
            <Badge colorScheme="purple" p={1}>
              {selectedFilters.climates.length} Climates
            </Badge>
          )}
          {selectedFilters.model_series.length > 0 && (
            <Badge colorScheme="orange" p={1}>
              {selectedFilters.model_series.length} Models
            </Badge>
          )}
          {selectedFilters.variables.length > 0 && (
            <Badge colorScheme="teal" p={1}>
              {selectedFilters.variables.length} Variables
            </Badge>
          )}
          <Badge colorScheme="cyan" p={1}>
            Value: {selectedFilters.value_range.min.toFixed(1)} - {selectedFilters.value_range.max.toFixed(1)}
          </Badge>
          <Badge colorScheme="pink" p={1}>
            Vehicles: {selectedFilters.vehicle_count_range.min} - {selectedFilters.vehicle_count_range.max}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
};

export default Filter;

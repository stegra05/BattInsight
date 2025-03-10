/* 
Ziel & Funktion:
	•	Stellt interaktive Filter (Dropdowns und Schieberegler) zur Verfügung, mit denen der Benutzer die anzuzeigenden Daten einschränken kann.
Abhängigkeiten:
	•	Kommuniziert mit der übergeordneten Komponente (z. B. HomePage.js), um Filtereinstellungen weiterzugeben.
	•	Erhält möglicherweise Optionen aus statischen Listen oder von API-Antworten.
*/

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Flex,
  Button,
  useColorModeValue,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { fetchAllFilterOptions } from '../api/apiClient';

const Filter = ({ onFilterChange }) => {
  const [filterOptions, setFilterOptions] = useState({
    continents: [],
    countries: [],
    climates: [],
    modelSeries: [],
  });
  
  const [filters, setFilters] = useState({
    continent: '',
    country: '',
    climate: '',
    model_series_id: '',
    val_min: 0,
    val_max: 200,
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const options = await fetchAllFilterOptions();
        setFilterOptions({
          continents: options.continents || [],
          countries: options.countries || [],
          climates: options.climates || [],
          modelSeries: options.model_series || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading filter options:', err);
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);
  
  useEffect(() => {
    // Notify parent component when filters change
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  const handleRangeChange = (values) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      val_min: values[0],
      val_max: values[1]
    }));
  };
  
  const handleReset = () => {
    setFilters({
      continent: '',
      country: '',
      climate: '',
      model_series_id: '',
      val_min: 0,
      val_max: 200,
    });
  };
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      bg={bgColor}
      p={5}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" mb={2}>
          Filter Data
        </Heading>
        
        <FormControl>
          <FormLabel>Continent</FormLabel>
          <Select
            placeholder="All Continents"
            name="continent"
            value={filters.continent}
            onChange={handleSelectChange}
            isDisabled={loading}
          >
            {filterOptions.continents.map(continent => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="All Countries"
            name="country"
            value={filters.country}
            onChange={handleSelectChange}
            isDisabled={loading}
          >
            {filterOptions.countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl>
          <FormLabel>Climate</FormLabel>
          <Select
            placeholder="All Climates"
            name="climate"
            value={filters.climate}
            onChange={handleSelectChange}
            isDisabled={loading}
          >
            {filterOptions.climates.map(climate => (
              <option key={climate} value={climate}>
                {climate}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl>
          <FormLabel>Model Series</FormLabel>
          <Select
            placeholder="All Models"
            name="model_series_id"
            value={filters.model_series_id}
            onChange={handleSelectChange}
            isDisabled={loading}
          >
            {filterOptions.modelSeries.map(model => (
              <option key={model.id} value={model.id}>
                {model.series_name}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <Divider my={2} />
        
        <FormControl>
          <FormLabel>Value Range</FormLabel>
          <RangeSlider
            min={0}
            max={200}
            step={5}
            defaultValue={[filters.val_min, filters.val_max]}
            onChange={handleRangeChange}
            isDisabled={loading}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="brand.500" />
            </RangeSliderTrack>
            <Tooltip label={filters.val_min}>
              <RangeSliderThumb index={0} />
            </Tooltip>
            <Tooltip label={filters.val_max}>
              <RangeSliderThumb index={1} />
            </Tooltip>
          </RangeSlider>
          <Flex justify="space-between" mt={2}>
            <Text fontSize="sm">{filters.val_min}</Text>
            <Text fontSize="sm">{filters.val_max}</Text>
          </Flex>
        </FormControl>
        
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={handleReset}
          isDisabled={loading}
        >
          Reset Filters
        </Button>
      </VStack>
    </Box>
  );
};

export default Filter;
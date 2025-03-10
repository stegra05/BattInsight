/* 
Ziel & Funktion:
	•	Hauptansicht der Anwendung, in der Datenvisualisierung, Filter und das AI-Feature zusammengeführt werden.
Abhängigkeiten:
	•	Nutzt Komponenten wie DataVisualization.js, Filter.js und AIQuery.js.
	•	Holt Daten über den API-Client aus apiClient.js.
*/

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Heading, 
  Text,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel 
} from '@chakra-ui/react';
import { BsBarChartFill, BsGlobe, BsBatteryFull, BsLightningCharge } from 'react-icons/bs';
import DataVisualization from './DataVisualization';
import Filter from './Filter';
import AIQuery from './AIQuery';
import { fetchData, fetchStats } from '../api/apiClient';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [stats, setStats] = useState({
    totalRecords: 0,
    avgValue: 0,
    countriesCount: 0,
    modelsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const responseData = await fetchData();
        setData(responseData);
        setFilteredData(responseData);
        
        const statsData = await fetchStats();
        setStats(statsData);
        
        setIsLoading(false);
      } catch (err) {
        setError('Error loading data. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    loadInitialData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    
    // Apply filters to data
    let filtered = [...data];
    
    if (newFilters.continent) {
      filtered = filtered.filter(item => item.continent === newFilters.continent);
    }
    
    if (newFilters.climate) {
      filtered = filtered.filter(item => item.climate === newFilters.climate);
    }
    
    if (newFilters.model_series_id) {
      filtered = filtered.filter(item => item.model_series_id === newFilters.model_series_id);
    }
    
    if (newFilters.val_min && newFilters.val_max) {
      filtered = filtered.filter(item => 
        item.val >= newFilters.val_min && item.val <= newFilters.val_max
      );
    }
    
    setFilteredData(filtered);
  };

  const handleAIQuery = async (query) => {
    try {
      setIsLoading(true);
      const responseData = await fetchData({ aiQuery: query });
      setFilteredData(responseData);
      setIsLoading(false);
    } catch (err) {
      setError('Error processing your query. Please try again.');
      setIsLoading(false);
      console.error('Error with AI query:', err);
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Battery Failure Visualization</Heading>
      <Text mb={6} color="gray.600">
        Interactive platform to visualize battery data and identify anomalies across different regions and models.
      </Text>
      
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Total Records"
          stat={stats.totalRecords.toLocaleString()}
          icon={<Icon as={BsBarChartFill} />}
          helpText="Battery data points analyzed"
        />
        <StatCard
          title="Average Value"
          stat={stats.avgValue.toFixed(2)}
          icon={<Icon as={BsLightningCharge} />}
          helpText="Mean capacity value"
        />
        <StatCard
          title="Countries"
          stat={stats.countriesCount}
          icon={<Icon as={BsGlobe} />}
          helpText="Geographic distribution"
        />
        <StatCard
          title="Models"
          stat={stats.modelsCount}
          icon={<Icon as={BsBatteryFull} />}
          helpText="Different battery models"
        />
      </SimpleGrid>
      
      {/* Main Content */}
      <Grid templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap={6}>
        <GridItem>
          <Filter onFilterChange={handleFilterChange} />
        </GridItem>
        
        <GridItem>
          <Tabs variant="enclosed" colorScheme="brand">
            <TabList>
              <Tab>Data Visualization</Tab>
              <Tab>AI Query</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel p={0} pt={5}>
                <DataVisualization 
                  data={filteredData} 
                  isLoading={isLoading} 
                  error={error} 
                />
              </TabPanel>
              <TabPanel p={0} pt={5}>
                <AIQuery onSubmitQuery={handleAIQuery} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, stat, icon, helpText }) => {
  return (
    <Stat
      px={4}
      py={5}
      bg={useColorModeValue('white', 'gray.700')}
      shadow="base"
      rounded="lg"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      borderWidth="1px"
    >
      <Flex justifyContent="space-between">
        <Box pl={2}>
          <StatLabel fontWeight="medium">{title}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">{stat}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Box>
        <Box
          my="auto"
          color={useColorModeValue('brand.500', 'brand.300')}
          alignContent="center"
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

export default HomePage;
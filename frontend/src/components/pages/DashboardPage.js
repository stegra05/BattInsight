import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Divider
} from '@chakra-ui/react';
import DataVisualization from '../features/DataVisualization';
import Filter from '../features/Filter';
import AIQuery from '../features/AIQuery';
import DataExport from '../features/DataExport';
import Loading from '../common/Loading';
import { useData } from '../../hooks/useData';

/**
 * DashboardPage component - main dashboard with data visualization and tools
 */
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({});
  const [aiQueryResults, setAiQueryResults] = useState(null);
  const { data, loading, stats, error, fetchData } = useData();

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchData(newFilters);
  };

  // Handle AI query submission
  const handleAiQuerySubmit = (queryText) => {
    console.log('AI Query submitted:', queryText);
    // AI query results will be set by the AIQuery component
  };

  return (
    <Container maxW="7xl" py={5}>
      <Heading as="h1" size="xl" mb={6}>
        Battery Data Dashboard
      </Heading>

      {/* Stats Overview */}
      {!loading && stats && (
        <Box 
          mb={8} 
          p={5} 
          borderRadius="lg" 
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="md"
        >
          <Heading as="h2" size="md" mb={4}>
            Overview
          </Heading>
          <StatGroup>
            <Stat>
              <StatLabel>Total Records</StatLabel>
              <StatNumber>{stats.totalRecords.toLocaleString()}</StatNumber>
              <StatHelpText>Battery data points</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Countries</StatLabel>
              <StatNumber>{stats.countriesCount}</StatNumber>
              <StatHelpText>Geographical coverage</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Model Series</StatLabel>
              <StatNumber>{stats.modelsCount}</StatNumber>
              <StatHelpText>Different battery models</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Average Value</StatLabel>
              <StatNumber>{stats.avgValue.toFixed(2)}</StatNumber>
              <StatHelpText>Across all batteries</StatHelpText>
            </Stat>
          </StatGroup>
        </Box>
      )}

      {/* Main Dashboard Content */}
      <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={8}>
        {/* Filters Panel */}
        <Box 
          gridColumn={{ lg: '1' }}
          p={5}
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="md"
          height="fit-content"
        >
          <Heading as="h2" size="md" mb={4}>
            Filters
          </Heading>
          <Filter onFilterChange={handleFilterChange} />
        </Box>

        {/* Main Content Area */}
        <Box 
          gridColumn={{ lg: '2 / span 3' }}
          p={5}
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="md"
        >
          <Tabs 
            isFitted 
            variant="enclosed" 
            colorScheme="blue" 
            onChange={(index) => setActiveTab(index)}
          >
            <TabList mb="1em">
              <Tab>Visualization</Tab>
              <Tab>AI Query</Tab>
              <Tab>Export</Tab>
            </TabList>
            <TabPanels>
              {/* Data Visualization Tab */}
              <TabPanel>
                {loading ? (
                  <Loading text="Loading data visualization..." />
                ) : error ? (
                  <Text color="red.500">Error loading data: {error}</Text>
                ) : (
                  <DataVisualization data={data} filters={filters} />
                )}
              </TabPanel>

              {/* AI Query Tab */}
              <TabPanel>
                <AIQuery 
                  onSubmitQuery={handleAiQuerySubmit} 
                  onQueryResults={setAiQueryResults}
                />
                
                {aiQueryResults && (
                  <Box mt={6}>
                    <Heading as="h3" size="md" mb={3}>
                      Query Results
                    </Heading>
                    <Divider mb={3} />
                    <DataVisualization 
                      data={aiQueryResults.data} 
                      isAiQueryResult={true}
                      sqlQuery={aiQueryResults.metadata?.sql_query}
                    />
                  </Box>
                )}
              </TabPanel>

              {/* Export Tab */}
              <TabPanel>
                <DataExport filters={filters} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </SimpleGrid>

      {/* Loading State */}
      {loading && (
        <Flex justify="center" mt={10}>
          <Loading />
        </Flex>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box mt={10} p={5} bg="red.50" color="red.500" borderRadius="md">
          <Text fontWeight="bold">Error:</Text>
          <Text>{error}</Text>
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;

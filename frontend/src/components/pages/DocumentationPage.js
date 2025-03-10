import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Divider,
  Link,
  ListItem,
  UnorderedList,
  useColorModeValue
} from '@chakra-ui/react';

/**
 * DocumentationPage component - documentation for using the BattInsight platform
 */
const DocumentationPage = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW={'7xl'} py={12}>
      <Heading as="h1" size="xl" mb={6}>
        Documentation
      </Heading>
      
      <Text fontSize="lg" mb={8}>
        Welcome to the BattInsight documentation. This guide will help you understand how to use the platform effectively to analyze battery data.
      </Text>
      
      <Accordion allowToggle defaultIndex={[0]} mb={10}>
        {/* Getting Started */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Getting Started
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              BattInsight is a platform for analyzing battery performance data across different regions, climates, and models. Here's how to get started:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem>Navigate to the Dashboard page to access the main features</ListItem>
              <ListItem>Use the Filters panel to narrow down the data you want to analyze</ListItem>
              <ListItem>Explore the data through the visualization tools</ListItem>
              <ListItem>Use the AI Query feature to ask questions about the data</ListItem>
              <ListItem>Export the data for further analysis in other tools</ListItem>
            </UnorderedList>
            <Text>
              The platform is designed to be intuitive, but this documentation provides detailed information about each feature.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        {/* Data Visualization */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Data Visualization
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              The Data Visualization tab provides interactive charts and maps to help you understand the battery data:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem><strong>Map View:</strong> Shows data geographically, with color coding based on values</ListItem>
              <ListItem><strong>Bar Charts:</strong> Compare values across different categories</ListItem>
              <ListItem><strong>Line Charts:</strong> Analyze trends over time or across series</ListItem>
              <ListItem><strong>Scatter Plots:</strong> Identify correlations between different variables</ListItem>
            </UnorderedList>
            <Text mb={4}>
              You can interact with the visualizations by:
            </Text>
            <UnorderedList spacing={2}>
              <ListItem>Hovering over elements to see detailed information</ListItem>
              <ListItem>Clicking on elements to filter the data</ListItem>
              <ListItem>Using the zoom and pan controls on maps</ListItem>
              <ListItem>Toggling different data series on and off</ListItem>
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>

        {/* Filtering */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Filtering Data
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              The Filters panel allows you to narrow down the data based on various criteria:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem><strong>Continent:</strong> Filter by continent (e.g., Europe, Asia)</ListItem>
              <ListItem><strong>Country:</strong> Filter by specific countries</ListItem>
              <ListItem><strong>Climate:</strong> Filter by climate type (e.g., normal, tropical)</ListItem>
              <ListItem><strong>Model Series:</strong> Filter by battery model series</ListItem>
              <ListItem><strong>Value Range:</strong> Filter by numerical value range</ListItem>
            </UnorderedList>
            <Text mb={4}>
              You can apply multiple filters simultaneously to focus on specific segments of the data. The visualizations will update automatically when you apply filters.
            </Text>
            <Text>
              To reset all filters, click the "Reset Filters" button at the bottom of the Filters panel.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        {/* AI Query */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                AI Query
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              The AI Query feature allows you to ask questions about the data in natural language. The system will convert your question into an SQL query and execute it against the database.
            </Text>
            <Text mb={4}>
              Example queries:
            </Text>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                Show me the average battery value for each country in Europe
              </Code>
            </Box>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                What are the top 5 countries with the highest battery values?
              </Code>
            </Box>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                Compare battery performance between normal and tropical climates
              </Code>
            </Box>
            <Text mb={4}>
              After submitting a query, you'll see:
            </Text>
            <UnorderedList spacing={2}>
              <ListItem>The SQL query generated from your question</ListItem>
              <ListItem>The query results in tabular format</ListItem>
              <ListItem>Visualizations of the query results</ListItem>
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>

        {/* Data Export */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Data Export
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              The Data Export tab allows you to download the filtered data in various formats for further analysis in other tools.
            </Text>
            <Text mb={4}>
              Available export formats:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem><strong>CSV:</strong> Comma-separated values format, suitable for spreadsheet applications</ListItem>
              <ListItem><strong>JSON:</strong> JavaScript Object Notation format, suitable for web applications</ListItem>
              <ListItem><strong>Excel:</strong> Microsoft Excel format, with proper formatting and data types</ListItem>
            </UnorderedList>
            <Text>
              The exported data will include all filters that you have applied in the Filters panel. This allows you to export exactly the data subset you're interested in.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        {/* API Reference */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                API Reference
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              BattInsight provides a RESTful API that you can use to access the data programmatically. Here are the main endpoints:
            </Text>
            
            <Heading as="h3" size="md" mt={4} mb={2}>
              Data Endpoints
            </Heading>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                GET /api/data - Get battery data with optional filtering
                GET /api/stats - Get statistics about the battery data
              </Code>
            </Box>
            
            <Heading as="h3" size="md" mt={4} mb={2}>
              Filter Endpoints
            </Heading>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                GET /api/filter/options - Get filter options (continents, countries, etc.)
                GET /api/filter/enhanced-options - Get enhanced filter options with metadata
                POST /api/filter/apply-enhanced - Apply advanced filters to data
              </Code>
            </Box>
            
            <Heading as="h3" size="md" mt={4} mb={2}>
              AI Query Endpoints
            </Heading>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                POST /api/ai-query - Convert natural language to SQL and execute query
              </Code>
            </Box>
            
            <Heading as="h3" size="md" mt={4} mb={2}>
              Export Endpoints
            </Heading>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                GET /api/export/csv - Export data as CSV
                GET /api/export/json - Export data as JSON
                GET /api/export/excel - Export data as Excel
              </Code>
            </Box>
            
            <Heading as="h3" size="md" mt={4} mb={2}>
              Mapbox Endpoints
            </Heading>
            <Box mb={4}>
              <Code p={3} display="block" whiteSpace="pre-wrap" borderRadius="md">
                GET /api/mapbox/country-data - Get aggregated data by country for map visualization
                GET /api/mapbox/config - Get Mapbox configuration for frontend
              </Code>
            </Box>
            
            <Text mt={4}>
              For detailed API documentation, including request and response formats, please refer to the <Link color="blue.500" href="#">API Documentation</Link>.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        {/* Troubleshooting */}
        <AccordionItem borderColor={borderColor}>
          <h2>
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Troubleshooting
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg={bgColor}>
            <Text mb={4}>
              If you encounter issues while using BattInsight, here are some common problems and solutions:
            </Text>
            
            <Heading as="h3" size="sm" mt={4} mb={2}>
              Data not loading
            </Heading>
            <Text mb={4}>
              If the data is not loading, try the following:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem>Refresh the page</ListItem>
              <ListItem>Check your internet connection</ListItem>
              <ListItem>Clear your browser cache</ListItem>
              <ListItem>Try a different browser</ListItem>
            </UnorderedList>
            
            <Heading as="h3" size="sm" mt={4} mb={2}>
              Filters not working
            </Heading>
            <Text mb={4}>
              If the filters are not working correctly, try:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem>Reset all filters and try again</ListItem>
              <ListItem>Apply filters one at a time to identify the issue</ListItem>
              <ListItem>Check if you have conflicting filters (e.g., selecting a country not in the selected continent)</ListItem>
            </UnorderedList>
            
            <Heading as="h3" size="sm" mt={4} mb={2}>
              AI Query errors
            </Heading>
            <Text mb={4}>
              If you're having issues with the AI Query feature:
            </Text>
            <UnorderedList spacing={2} mb={4}>
              <ListItem>Make sure your query is clear and specific</ListItem>
              <ListItem>Avoid complex queries with multiple conditions</ListItem>
              <ListItem>Check if you're using terms that match the database schema</ListItem>
              <ListItem>Try one of the example queries provided</ListItem>
            </UnorderedList>
            
            <Text>
              If you continue to experience issues, please contact our support team at <Link color="blue.500" href="mailto:support@battinsight.com">support@battinsight.com</Link>.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      
      <Divider my={8} />
      
      <Box textAlign="center">
        <Text>
          Need more help? Contact us at <Link color="blue.500" href="mailto:support@battinsight.com">support@battinsight.com</Link>
        </Text>
      </Box>
    </Container>
  );
};

export default DocumentationPage;

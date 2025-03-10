import React, { useState, useRef } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Text,
  Code,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useToast
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient';

/**
 * AIQuery component for natural language to SQL queries
 */
const AIQuery = ({ onSubmitQuery, onQueryResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const apiClient = useApiClient();
  const toast = useToast();
  const textareaRef = useRef(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Example queries to help users get started
  const exampleQueries = [
    "Show me the average battery value for each country in Europe",
    "What are the top 5 countries with the highest battery values?",
    "Compare battery performance between normal and tropical climates",
    "Which model series has the best performance in cold climates?",
    "Show me countries with more than 100 vehicle count and value above 50"
  ];

  // Handle query submission
  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: 'Empty Query',
        description: 'Please enter a query to proceed.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null);
      setSqlQuery('');

      // Call the API to process the query
      const response = await apiClient.submitAiQuery(query);
      
      // Update state with results
      setResults(response.data);
      setSqlQuery(response.metadata?.sql_query || '');
      
      // Notify parent components
      if (onSubmitQuery) {
        onSubmitQuery(query);
      }
      
      if (onQueryResults) {
        onQueryResults(response);
      }
      
      toast({
        title: 'Query Processed',
        description: 'Your query has been successfully processed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error processing AI query:', err);
      setError(err.message || 'Failed to process query');
      
      toast({
        title: 'Query Error',
        description: err.message || 'Failed to process query',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Use an example query
  const useExampleQuery = (example) => {
    setQuery(example);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Clear the query and results
  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSqlQuery('');
    setError(null);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        AI Query
      </Heading>
      
      <Text mb={4}>
        Ask questions about the battery data in natural language. The AI will convert your question into SQL and execute it.
      </Text>
      
      {/* Query Input */}
      <FormControl mb={4}>
        <FormLabel fontWeight="medium">Your Question</FormLabel>
        <Textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Show me the average battery value for each country in Europe"
          size="md"
          rows={3}
          isDisabled={loading}
        />
      </FormControl>
      
      {/* Example Queries */}
      <Box mb={4}>
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Example Queries:
        </Text>
        <Flex wrap="wrap" gap={2}>
          {exampleQueries.map((example, index) => (
            <Badge
              key={index}
              colorScheme="blue"
              p={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'blue.100' }}
              onClick={() => useExampleQuery(example)}
            >
              {example}
            </Badge>
          ))}
        </Flex>
      </Box>
      
      {/* Action Buttons */}
      <Flex justify="space-between" mb={6}>
        <Button
          colorScheme="gray"
          onClick={handleClear}
          isDisabled={loading}
        >
          Clear
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Processing..."
        >
          Submit Query
        </Button>
      </Flex>
      
      {/* Loading State */}
      {loading && (
        <Flex justify="center" my={8}>
          <Box textAlign="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              mb={4}
            />
            <Text>Processing your query...</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              This may take a few seconds
            </Text>
          </Box>
        </Flex>
      )}
      
      {/* Error State */}
      {error && (
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <Box>
            <AlertTitle>Error Processing Query</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      )}
      
      {/* Results */}
      {results && (
        <Box mt={6}>
          {/* SQL Query */}
          <Box mb={6}>
            <Heading as="h3" size="md" mb={2}>
              Generated SQL Query
            </Heading>
            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              fontFamily="mono"
              fontSize="sm"
              overflowX="auto"
            >
              <Code display="block" whiteSpace="pre-wrap">
                {sqlQuery}
              </Code>
            </Box>
          </Box>
          
          <Divider mb={6} />
          
          {/* Results Table */}
          <Box>
            <Heading as="h3" size="md" mb={4}>
              Query Results
              <Badge ml={2} colorScheme="green">
                {results.length} records
              </Badge>
            </Heading>
            
            {results.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription>No results found for this query.</AlertDescription>
              </Alert>
            ) : (
              <TableContainer
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                overflowX="auto"
              >
                <Table variant="simple" size="sm">
                  <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                    <Tr>
                      {Object.keys(results[0]).map((key) => (
                        <Th key={key}>{key}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {results.slice(0, 20).map((row, rowIndex) => (
                      <Tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <Td key={colIndex}>
                            {typeof value === 'number' 
                              ? Number.isInteger(value) 
                                ? value 
                                : value.toFixed(2)
                              : String(value)}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            
            {results.length > 20 && (
              <Text mt={2} fontSize="sm" color="gray.500">
                Showing 20 of {results.length} records
              </Text>
            )}
          </Box>
        </Box>
      )}
      
      {/* Tips */}
      <Box mt={8} p={4} bg="blue.50" borderRadius="md">
        <Heading as="h3" size="sm" mb={2} color="blue.700">
          Tips for Better Results
        </Heading>
        <Text fontSize="sm" color="blue.700">
          • Be specific about what data you want to see<br />
          • Mention specific countries, climates, or model series if relevant<br />
          • For comparisons, clearly state what you want to compare<br />
          • Use terms like "average", "maximum", "minimum" for aggregations<br />
          • Specify limits like "top 5" or "bottom 10" when needed
        </Text>
      </Box>
    </Box>
  );
};

export default AIQuery;

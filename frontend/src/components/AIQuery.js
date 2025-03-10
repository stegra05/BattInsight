/* 
Ziel & Funktion:
	•	Bietet ein Texteingabefeld, in das Benutzer ihre natürlichen Sprachabfragen eingeben können.
	•	Leitet diese Abfragen über den API-Client an den /api/ai-query Endpunkt weiter und zeigt die Ergebnisse an.
Abhängigkeiten:
	•	Nutzt Funktionen aus apiClient.js zur Kommunikation mit dem Backend.
	•	Wird in HomePage.js integriert.
*/

import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Textarea,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  InputGroup,
  Flex,
  Heading,
  Badge,
  Card,
  CardBody,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { sendAIQuery } from '../api/apiClient';

const EXAMPLE_QUERIES = [
  "Show me all battery data from Europe with temperate climate",
  "Which countries have the highest average battery capacity?",
  "Compare battery performance between Germany and France",
  "Show data for the X300 model series where the value is greater than 100"
];

const AIQuery = ({ onSubmitQuery }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sql, setSql] = useState('');
  const [, setResult] = useState(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };
  
  const handleExampleClick = (example) => {
    setQuery(example);
  };
  
  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a query before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setSql('');
      setResult(null);
      
      const response = await sendAIQuery(query);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSql(response.sql);
        setResult(response.data);
        
        // Notify parent component to update visualization
        if (onSubmitQuery) {
          onSubmitQuery(query);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred while processing your query.');
      console.error('Error with AI query:', err);
    }
  };
  
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Heading size="md" mb={2}>
            AI-Powered Query
            <Badge ml={2} colorScheme="purple">
              Beta
            </Badge>
          </Heading>
          <Text color="gray.600" mb={4}>
            Ask questions about battery data in natural language. Our AI will convert your query into a database search.
          </Text>
        </Box>
        
        <Box
          bg={bgColor}
          p={5}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <InputGroup>
            <Textarea
              placeholder="e.g., Show me battery data from Germany with values above 100"
              value={query}
              onChange={handleQueryChange}
              rows={3}
              mb={4}
            />
          </InputGroup>
          
          <Flex justifyContent="space-between">
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Processing..."
              onClick={handleSubmit}
            >
              Submit Query
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setQuery('')}
              isDisabled={isLoading || !query}
            >
              Clear
            </Button>
          </Flex>
        </Box>
        
        <Box>
          <Text fontWeight="medium" mb={2}>
            Example Queries:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {EXAMPLE_QUERIES.map((example, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </Flex>
        </Box>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {sql && (
          <Card>
            <CardBody>
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton px={0}>
                      <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                        Generated SQL Query
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg="gray.50" borderRadius="md" p={3}>
                    <Text as="pre" fontSize="sm" overflowX="auto" p={2}>
                      {sql}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default AIQuery;
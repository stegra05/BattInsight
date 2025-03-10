import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormControl,
  FormLabel,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  useToast,
  Link,
  Code
} from '@chakra-ui/react';
import { FaFileDownload, FaFileCsv, FaFileCode, FaFileExcel } from 'react-icons/fa';
import { useApiClient } from '../../hooks/useApiClient';

/**
 * DataExport component for exporting filtered data
 */
const DataExport = ({ filters }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOption, setExportOption] = useState('filtered');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiClient = useApiClient();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Handle export action
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine which filters to use
      const exportFilters = exportOption === 'filtered' ? filters : {};
      
      // Call the appropriate export endpoint based on format
      let url;
      switch (exportFormat) {
        case 'csv':
          url = await apiClient.exportCsv(exportFilters);
          break;
        case 'json':
          url = await apiClient.exportJson(exportFilters);
          break;
        case 'excel':
          url = await apiClient.exportExcel(exportFilters);
          break;
        default:
          throw new Error('Invalid export format');
      }
      
      // Trigger download
      if (url) {
        window.open(url, '_blank');
      }
      
      toast({
        title: 'Export Successful',
        description: `Data has been exported in ${exportFormat.toUpperCase()} format.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err.message || 'Failed to export data');
      
      toast({
        title: 'Export Error',
        description: err.message || 'Failed to export data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get icon for export format
  const getFormatIcon = (format) => {
    switch (format) {
      case 'csv':
        return FaFileCsv;
      case 'json':
        return FaFileCode;
      case 'excel':
        return FaFileExcel;
      default:
        return FaFileDownload;
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Export Data
      </Heading>
      
      <Text mb={6}>
        Export the battery data in various formats for further analysis in other tools. You can export all data or just the filtered data.
      </Text>
      
      {/* Export Options */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
        {/* Format Selection */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          bg={bgColor}
        >
          <Heading as="h3" size="md" mb={4}>
            Export Format
          </Heading>
          
          <RadioGroup onChange={setExportFormat} value={exportFormat} mb={4}>
            <Stack spacing={4}>
              <ExportFormatOption
                value="csv"
                label="CSV (Comma-Separated Values)"
                description="Best for spreadsheet applications like Excel or Google Sheets"
                icon={FaFileCsv}
                isSelected={exportFormat === 'csv'}
              />
              
              <ExportFormatOption
                value="json"
                label="JSON (JavaScript Object Notation)"
                description="Best for web applications and data processing"
                icon={FaFileCode}
                isSelected={exportFormat === 'json'}
              />
              
              <ExportFormatOption
                value="excel"
                label="Excel (.xlsx)"
                description="Native Microsoft Excel format with formatting"
                icon={FaFileExcel}
                isSelected={exportFormat === 'excel'}
              />
            </Stack>
          </RadioGroup>
        </Box>
        
        {/* Data Selection */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          bg={bgColor}
        >
          <Heading as="h3" size="md" mb={4}>
            Data Selection
          </Heading>
          
          <RadioGroup onChange={setExportOption} value={exportOption} mb={4}>
            <Stack spacing={4}>
              <Radio value="filtered" colorScheme="blue">
                <Box>
                  <Text fontWeight="medium">Filtered Data</Text>
                  <Text fontSize="sm" color="gray.500">
                    Export only the data matching your current filters
                  </Text>
                </Box>
              </Radio>
              
              <Radio value="all" colorScheme="blue">
                <Box>
                  <Text fontWeight="medium">All Data</Text>
                  <Text fontSize="sm" color="gray.500">
                    Export the complete dataset (ignores filters)
                  </Text>
                </Box>
              </Radio>
            </Stack>
          </RadioGroup>
          
          {/* Filter Summary */}
          {exportOption === 'filtered' && Object.keys(filters || {}).length > 0 && (
            <Box mt={4} p={3} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" color="blue.700">
                Active Filters:
              </Text>
              <Text fontSize="sm" color="blue.700">
                {Object.keys(filters).map(key => {
                  if (Array.isArray(filters[key]) && filters[key].length > 0) {
                    return `${key}: ${filters[key].length} selected`;
                  } else if (typeof filters[key] === 'object' && filters[key] !== null) {
                    return `${key}: ${JSON.stringify(filters[key])}`;
                  }
                  return null;
                }).filter(Boolean).join(', ')}
              </Text>
            </Box>
          )}
        </Box>
      </SimpleGrid>
      
      {/* Error Message */}
      {error && (
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <Box>
            <AlertTitle>Export Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      )}
      
      {/* Export Button */}
      <Flex justify="center" mb={8}>
        <Button
          colorScheme="blue"
          size="lg"
          leftIcon={<Icon as={getFormatIcon(exportFormat)} />}
          onClick={handleExport}
          isLoading={loading}
          loadingText="Exporting..."
          px={8}
        >
          Export as {exportFormat.toUpperCase()}
        </Button>
      </Flex>
      
      <Divider mb={8} />
      
      {/* Format Information */}
      <Box>
        <Heading as="h3" size="md" mb={4}>
          Format Information
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <FormatInfo
            title="CSV Format"
            description="Comma-Separated Values format stores tabular data in plain text. Each line represents a row, and columns are separated by commas."
            useCases={['Spreadsheet applications', 'Data analysis tools', 'Database imports']}
            example='id,country,value\n1,"Germany",42.5\n2,"France",38.2'
          />
          
          <FormatInfo
            title="JSON Format"
            description="JavaScript Object Notation is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate."
            useCases={['Web applications', 'APIs', 'Configuration files']}
            example='[\n  {\n    "id": 1,\n    "country": "Germany",\n    "value": 42.5\n  },\n  {\n    "id": 2,\n    "country": "France",\n    "value": 38.2\n  }\n]'
          />
          
          <FormatInfo
            title="Excel Format"
            description="Microsoft Excel's native format (.xlsx) supports rich formatting, multiple worksheets, formulas, and charts."
            useCases={['Microsoft Excel', 'Data analysis', 'Reporting']}
            example="Binary format with proper data types and formatting"
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// Component for export format option
const ExportFormatOption = ({ value, label, description, icon, isSelected }) => {
  return (
    <Radio value={value} colorScheme="blue">
      <Flex align="center">
        <Icon as={icon} boxSize={5} color={isSelected ? 'blue.500' : 'gray.400'} mr={3} />
        <Box>
          <Text fontWeight="medium">{label}</Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </Box>
      </Flex>
    </Radio>
  );
};

// Component for format information
const FormatInfo = ({ title, description, useCases, example }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      <Heading as="h4" size="sm" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" mb={3}>
        {description}
      </Text>
      <Text fontSize="sm" fontWeight="medium" mb={1}>
        Common Use Cases:
      </Text>
      <Box as="ul" pl={4} mb={3} fontSize="sm">
        {useCases.map((useCase, index) => (
          <Box as="li" key={index}>
            {useCase}
          </Box>
        ))}
      </Box>
      <Text fontSize="sm" fontWeight="medium" mb={1}>
        Example:
      </Text>
      <Box
        p={2}
        bg={bgColor}
        borderRadius="md"
        fontSize="xs"
        fontFamily="mono"
        overflowX="auto"
      >
        <Code>{example}</Code>
      </Box>
    </Box>
  );
};

export default DataExport;

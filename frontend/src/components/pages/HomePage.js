import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  Image, 
  Flex, 
  Stack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaChartLine, FaDatabase, FaRobot, FaMapMarkedAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

/**
 * HomePage component - landing page for the application
 */
const HomePage = () => {
  return (
    <Container maxW={'7xl'}>
      {/* Hero Section */}
      <Box
        as="section"
        py={{ base: 8, md: 12 }}
        textAlign="center"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          mb={4}
          color={useColorModeValue('blue.600', 'blue.300')}
        >
          BattInsight
        </Heading>
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          maxW="3xl"
          mx="auto"
          mb={8}
          color={useColorModeValue('gray.600', 'gray.300')}
        >
          Interactive platform to visualize battery data and identify anomalies across different regions and models.
        </Text>
        <Button
          as={RouterLink}
          to="/dashboard"
          size="lg"
          colorScheme="blue"
          px={8}
          mb={8}
        >
          Explore Dashboard
        </Button>
        
        <Box mt={12}>
          <Image
            src="https://via.placeholder.com/1200x600?text=Battery+Data+Visualization"
            alt="Battery Data Visualization"
            borderRadius="lg"
            shadow="2xl"
            mx="auto"
          />
        </Box>
      </Box>

      {/* Features Section */}
      <Box as="section" py={12}>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
        >
          Key Features
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <Feature
            icon={<Icon as={FaChartLine} w={10} h={10} />}
            title="Data Visualization"
            text="Interactive charts and graphs to visualize battery performance data."
          />
          <Feature
            icon={<Icon as={FaDatabase} w={10} h={10} />}
            title="Advanced Filtering"
            text="Filter data by continent, country, climate, model series, and value ranges."
          />
          <Feature
            icon={<Icon as={FaRobot} w={10} h={10} />}
            title="AI-Powered Queries"
            text="Use natural language to generate SQL queries for complex data analysis."
          />
          <Feature
            icon={<Icon as={FaMapMarkedAlt} w={10} h={10} />}
            title="Geographic Mapping"
            text="Visualize data geographically with interactive maps."
          />
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <Box
        as="section"
        py={12}
        bg={useColorModeValue('blue.50', 'blue.900')}
        borderRadius="lg"
        mt={12}
        mb={8}
        p={8}
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          align="center"
          justify="space-between"
        >
          <Box maxW="lg">
            <Heading as="h3" size="lg" mb={4}>
              Ready to analyze your battery data?
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
              Get started with our interactive dashboard and discover insights about battery performance across different regions and models.
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/dashboard"
            size="lg"
            colorScheme="blue"
            px={8}
          >
            Go to Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

// Feature component for the features section
const Feature = ({ title, text, icon }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      textAlign="center"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={useColorModeValue('blue.500', 'blue.300')}
        mb={4}
        mx="auto"
      >
        {icon}
      </Flex>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </Box>
  );
};

export default HomePage;

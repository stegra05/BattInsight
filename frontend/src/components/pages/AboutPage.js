import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Stack,
  Flex,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

/**
 * AboutPage component - information about the BattInsight project
 */
const AboutPage = () => {
  return (
    <Container maxW={'7xl'} py={12}>
      <Heading as="h1" size="xl" mb={6}>
        About BattInsight
      </Heading>
      
      {/* Project Overview */}
      <Box mb={12}>
        <Heading as="h2" size="lg" mb={4}>
          Project Overview
        </Heading>
        <Text fontSize="lg" mb={4}>
          BattInsight is a comprehensive platform designed to analyze and visualize battery performance data across different regions, climates, and models. Our mission is to provide actionable insights that help improve battery technology and performance worldwide.
        </Text>
        <Text fontSize="lg" mb={4}>
          By leveraging advanced data visualization techniques and AI-powered analytics, BattInsight enables researchers, manufacturers, and analysts to identify patterns, anomalies, and opportunities for optimization in battery performance.
        </Text>
        <Image
          src="https://via.placeholder.com/1200x400?text=BattInsight+Overview"
          alt="BattInsight Overview"
          borderRadius="lg"
          my={6}
        />
      </Box>
      
      {/* Key Features */}
      <Box mb={12}>
        <Heading as="h2" size="lg" mb={4}>
          Key Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Feature
            title="Interactive Data Visualization"
            text="Explore battery data through interactive charts, maps, and graphs that make complex data easy to understand and analyze."
          />
          <Feature
            title="Advanced Filtering"
            text="Filter data by continent, country, climate, model series, and value ranges to focus on specific segments of interest."
          />
          <Feature
            title="AI-Powered Queries"
            text="Use natural language to generate SQL queries, making complex data analysis accessible to non-technical users."
          />
          <Feature
            title="Geographic Mapping"
            text="Visualize data geographically to identify regional patterns and variations in battery performance."
          />
          <Feature
            title="Data Export"
            text="Export filtered data in various formats (CSV, JSON, Excel) for further analysis in other tools."
          />
          <Feature
            title="Comprehensive Analytics"
            text="Gain insights through statistical analysis and performance metrics across different dimensions."
          />
        </SimpleGrid>
      </Box>
      
      {/* Technology Stack */}
      <Box mb={12}>
        <Heading as="h2" size="lg" mb={4}>
          Technology Stack
        </Heading>
        <Text fontSize="lg" mb={4}>
          BattInsight is built using modern technologies to ensure performance, scalability, and maintainability:
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={6}>
          <TechStack
            title="Frontend"
            items={['React', 'Chakra UI', 'D3.js', 'Mapbox GL', 'Axios']}
          />
          <TechStack
            title="Backend"
            items={['Flask', 'SQLAlchemy', 'PostgreSQL', 'OpenAI API', 'Pandas']}
          />
          <TechStack
            title="DevOps"
            items={['Docker', 'Docker Compose', 'Nginx', 'Git', 'GitHub Actions']}
          />
        </SimpleGrid>
      </Box>
      
      {/* Team */}
      <Box>
        <Heading as="h2" size="lg" mb={6}>
          Our Team
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <TeamMember
            name="Jane Doe"
            role="Lead Data Scientist"
            image="https://via.placeholder.com/150"
            bio="PhD in Machine Learning with 10+ years of experience in battery technology research."
          />
          <TeamMember
            name="John Smith"
            role="Full Stack Developer"
            image="https://via.placeholder.com/150"
            bio="Software engineer specializing in data visualization and interactive web applications."
          />
          <TeamMember
            name="Alex Johnson"
            role="UX/UI Designer"
            image="https://via.placeholder.com/150"
            bio="Designer focused on creating intuitive interfaces for complex data analysis tools."
          />
        </SimpleGrid>
      </Box>
    </Container>
  );
};

// Feature component for the features section
const Feature = ({ title, text }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </Box>
  );
};

// TechStack component for the technology stack section
const TechStack = ({ title, items }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Heading as="h3" size="md" mb={4} textAlign="center">
        {title}
      </Heading>
      <Stack spacing={2}>
        {items.map((item, index) => (
          <Text
            key={index}
            p={2}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="md"
            textAlign="center"
          >
            {item}
          </Text>
        ))}
      </Stack>
    </Box>
  );
};

// TeamMember component for the team section
const TeamMember = ({ name, role, image, bio }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.700')}
      textAlign="center"
    >
      <Flex direction="column" align="center">
        <Avatar size="xl" src={image} mb={4} />
        <Heading as="h3" size="md">
          {name}
        </Heading>
        <Text fontWeight="bold" color="blue.500" mb={2}>
          {role}
        </Text>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>
          {bio}
        </Text>
      </Flex>
    </Box>
  );
};

export default AboutPage;

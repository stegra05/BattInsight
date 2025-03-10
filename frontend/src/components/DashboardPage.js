/* 
Ziel & Funktion:
	•	Dashboard-Seite für die BattInsight-Anwendung.
	•	Stellt eine Übersicht der wichtigsten Batteriedaten und KPIs dar.
	•	Bietet verschiedene Visualisierungen und Zugriff auf Hauptfunktionen.
Abhängigkeiten:
	•	Verwendet Chakra UI für das Layout und die Komponenten.
	•	Integriert die DataVisualization-Komponente für die Kartenansicht.
	•	Verwendet Filter-Komponente für Datenfilterung.
*/

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex,
  Badge,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Icon,
  Progress
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaMapMarkedAlt } from 'react-icons/fa';
import DataVisualization from './DataVisualization';
import Filter from './Filter';
import AIQuery from './AIQuery';

const DashboardPage = () => {
  const [filterSettings, setFilterSettings] = useState({
    continent: '',
    country: '',
    climate: '',
    model_series: '',
    timeRange: 'all'
  });

  const [summaryData, setSummaryData] = useState({
    total_batteries: 2450,
    failure_rate: 3.7,
    failure_rate_change: -0.4,
    avg_lifetime: 4.2,
    avg_lifetime_change: 0.3,
    regions_with_issues: 12,
    top_performers: ['Model X123', 'Model Y456', 'Model Z789'],
    issue_distribution: {
      'Hardware Failure': 35,
      'Capacity Loss': 42,
      'Thermal Issues': 15,
      'Connection Problems': 8
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (name, value) => {
    setFilterSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simuliere Daten-Fetch, wenn Filter sich ändern
  useEffect(() => {
    setIsLoading(true);
    // Simuliere API-Aufruf
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Hier würden normalerweise die Daten vom Backend geholt
    }, 800);
    
    return () => clearTimeout(timer);
  }, [filterSettings]);

  return (
    <Container maxW="1400px" py={6}>
      <Heading as="h1" size="xl" mb={6}>BattInsight Dashboard</Heading>
      
      {/* Filter-Sektion */}
      <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg="white">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="md">Filter</Heading>
          <Button size="sm" colorScheme="blue" onClick={() => setFilterSettings({
            continent: '',
            country: '',
            climate: '',
            model_series: '',
            timeRange: 'all'
          })}>
            Filter zurücksetzen
          </Button>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
          <Box>
            <Text mb={2} fontWeight="medium">Kontinent</Text>
            <Select 
              value={filterSettings.continent} 
              onChange={(e) => handleFilterChange('continent', e.target.value)}
              placeholder="Alle Kontinente"
            >
              <option value="europe">Europa</option>
              <option value="northamerica">Nordamerika</option>
              <option value="asia">Asien</option>
              <option value="southamerica">Südamerika</option>
              <option value="africa">Afrika</option>
              <option value="australia">Australien</option>
            </Select>
          </Box>
          
          <Box>
            <Text mb={2} fontWeight="medium">Land</Text>
            <Select 
              value={filterSettings.country} 
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Alle Länder"
            >
              <option value="germany">Deutschland</option>
              <option value="usa">USA</option>
              <option value="china">China</option>
              <option value="japan">Japan</option>
              <option value="france">Frankreich</option>
            </Select>
          </Box>
          
          <Box>
            <Text mb={2} fontWeight="medium">Klima</Text>
            <Select 
              value={filterSettings.climate} 
              onChange={(e) => handleFilterChange('climate', e.target.value)}
              placeholder="Alle Klimazonen"
            >
              <option value="cold">Kalt</option>
              <option value="moderate">Gemäßigt</option>
              <option value="hot">Heiß</option>
              <option value="tropical">Tropisch</option>
            </Select>
          </Box>
          
          <Box>
            <Text mb={2} fontWeight="medium">Modellserie</Text>
            <Select 
              value={filterSettings.model_series} 
              onChange={(e) => handleFilterChange('model_series', e.target.value)}
              placeholder="Alle Modelle"
            >
              <option value="x123">Model X123</option>
              <option value="y456">Model Y456</option>
              <option value="z789">Model Z789</option>
            </Select>
          </Box>
          
          <Box>
            <Text mb={2} fontWeight="medium">Zeitraum</Text>
            <Select 
              value={filterSettings.timeRange} 
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            >
              <option value="all">Alle Daten</option>
              <option value="last30">Letzte 30 Tage</option>
              <option value="last90">Letzte 90 Tage</option>
              <option value="last365">Letztes Jahr</option>
            </Select>
          </Box>
        </SimpleGrid>
      </Box>

      {isLoading && <Progress size="xs" isIndeterminate colorScheme="blue" mb={6} />}
      
      {/* KPI-Übersicht */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <StatLabel fontSize="md">Gesamtzahl Batterien</StatLabel>
          <Flex alignItems="center">
            <Icon as={FaBatteryFull} color="blue.500" boxSize={6} mr={2} />
            <StatNumber>{summaryData.total_batteries}</StatNumber>
          </Flex>
          <StatHelpText>
            <StatArrow type="increase" />
            5% seit letztem Monat
          </StatHelpText>
        </Stat>
        
        <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <StatLabel fontSize="md">Durchschn. Ausfallrate</StatLabel>
          <Flex alignItems="center">
            <Icon as={FaBatteryQuarter} color="red.500" boxSize={6} mr={2} />
            <StatNumber>{summaryData.failure_rate}%</StatNumber>
          </Flex>
          <StatHelpText>
            <StatArrow type="decrease" />
            {Math.abs(summaryData.failure_rate_change)}% seit letztem Monat
          </StatHelpText>
        </Stat>
        
        <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <StatLabel fontSize="md">Durchschn. Lebensdauer</StatLabel>
          <Flex alignItems="center">
            <Icon as={FaBatteryHalf} color="green.500" boxSize={6} mr={2} />
            <StatNumber>{summaryData.avg_lifetime} Jahre</StatNumber>
          </Flex>
          <StatHelpText>
            <StatArrow type="increase" />
            {summaryData.avg_lifetime_change} Jahre seit letztem Jahr
          </StatHelpText>
        </Stat>
        
        <Stat p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <StatLabel fontSize="md">Regionen mit Problemen</StatLabel>
          <Flex alignItems="center">
            <Icon as={FaMapMarkedAlt} color="orange.500" boxSize={6} mr={2} />
            <StatNumber>{summaryData.regions_with_issues}</StatNumber>
          </Flex>
          <StatHelpText>
            <StatArrow type="decrease" />
            2 weniger als im Vormonat
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Hauptinhalt mit Tabs */}
      <Tabs colorScheme="blue" mb={8}>
        <TabList>
          <Tab>Weltkarte</Tab>
          <Tab>Tabellendaten</Tab>
          <Tab>Fehleranalyse</Tab>
          <Tab>KI-Abfrage</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <Box 
              height="500px" 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              position="relative"
              bg="gray.50"
            >
              <DataVisualization filterSettings={filterSettings} />
            </Box>
          </TabPanel>
          
          <TabPanel p={0} pt={4}>
            <Box 
              height="500px" 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              position="relative"
              p={4}
              bg="white"
            >
              <Heading as="h3" size="md" mb={4}>Batteriedaten</Heading>
              <Text>
                Hier würde eine tabellarische Darstellung der Batteriedaten angezeigt werden,
                die nach den gewählten Filterkriterien gefiltert sind.
              </Text>
            </Box>
          </TabPanel>
          
          <TabPanel p={0} pt={4}>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              <Box 
                height="500px" 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden"
                position="relative"
                p={4}
                bg="white"
              >
                <Heading as="h3" size="md" mb={4}>Fehlerkategorien</Heading>
                <Box height="400px" position="relative">
                  {/* Hier würde ein Diagramm der Fehlerverteilung sein */}
                  <Flex direction="column" height="100%">
                    {Object.entries(summaryData.issue_distribution).map(([category, percentage]) => (
                      <Box key={category} mb={4}>
                        <Flex justify="space-between" mb={1}>
                          <Text>{category}</Text>
                          <Text fontWeight="bold">{percentage}%</Text>
                        </Flex>
                        <Progress value={percentage} colorScheme={
                          category === 'Hardware Failure' ? 'red' :
                          category === 'Capacity Loss' ? 'orange' :
                          category === 'Thermal Issues' ? 'yellow' : 'blue'
                        } />
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Box>
              
              <Box 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden"
                position="relative"
                p={4}
                bg="white"
              >
                <Heading as="h3" size="md" mb={4}>Top-Performer</Heading>
                <Text mb={4}>Modelle mit der niedrigsten Ausfallrate:</Text>
                
                {summaryData.top_performers.map((model, index) => (
                  <Flex 
                    key={model} 
                    p={3} 
                    mb={3} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    bg="blue.50" 
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <Badge colorScheme="blue" mr={2}>{index + 1}</Badge>
                      <Text fontWeight="medium">{model}</Text>
                    </Flex>
                    <Badge colorScheme="green">
                      {index === 0 ? '1.2%' : index === 1 ? '1.8%' : '2.1%'}
                    </Badge>
                  </Flex>
                ))}
                
                <Button 
                  rightIcon={<ArrowForwardIcon />} 
                  colorScheme="blue" 
                  variant="outline"
                  mt={4}
                  size="sm"
                  alignSelf="flex-end"
                >
                  Alle Modelle anzeigen
                </Button>
              </Box>
            </Grid>
          </TabPanel>
          
          <TabPanel p={0} pt={4}>
            <Box 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              position="relative"
              p={4}
              bg="white"
            >
              <AIQuery />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Schnellzugriff auf wichtige Funktionen */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Heading as="h3" size="md" mb={3}>Datenexport</Heading>
          <Text mb={4}>
            Exportieren Sie die aktuell gefilterten Daten in verschiedenen Formaten für weitere Analysen.
          </Text>
          <Button size="sm" colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
            Daten exportieren
          </Button>
        </Box>
        
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Heading as="h3" size="md" mb={3}>Berichte</Heading>
          <Text mb={4}>
            Generieren Sie automatisierte Berichte mit den wichtigsten Erkenntnissen aus Ihren Batteriedaten.
          </Text>
          <Button size="sm" colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
            Bericht erstellen
          </Button>
        </Box>
        
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Heading as="h3" size="md" mb={3}>Prognosen</Heading>
          <Text mb={4}>
            Nutzen Sie KI-gestützte Prognosen, um zukünftige Batterieausfälle vorherzusagen.
          </Text>
          <Button size="sm" colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
            Prognosen ansehen
          </Button>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage; 
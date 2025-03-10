/* 
Ziel & Funktion:
	•	About-Seite für die BattInsight-Anwendung.
	•	Stellt Informationen über das Projekt, das Team und die Technologien bereit.
	•	Erläutert die Mission und Ziele des Projekts.
Abhängigkeiten:
	•	Verwendet Chakra UI für das Layout und die Komponenten.
*/

import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Grid, 
  GridItem, 
  Image, 
  SimpleGrid, 
  Divider, 
  Link, 
  Icon, 
  Flex, 
  Badge, 
  VStack, 
  HStack
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const AboutPage = () => {
  return (
    <Container maxW="1200px" py={8}>
      <Box textAlign="center" mb={12}>
        <Heading as="h1" size="2xl" mb={4}>Über BattInsight</Heading>
        <Text fontSize="xl" maxW="800px" mx="auto">
          BattInsight ist eine interaktive Plattform zur Visualisierung von Batterie-Daten, 
          die es ermöglicht, Anomalien und potenzielle Ausfälle in Batteriedaten zu erkennen und zu analysieren.
        </Text>
      </Box>

      {/* Unsere Mission */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={16} alignItems="center">
        <GridItem>
          <Heading as="h2" size="lg" mb={4}>Unsere Mission</Heading>
          <Text mb={4}>
            Mit BattInsight verfolgen wir das Ziel, komplexe Batteriedaten zugänglich und verständlich zu machen. 
            Durch fortschrittliche Visualisierungstechniken und KI-gestützte Analysen ermöglichen wir es Anwendern, 
            wertvolle Einblicke zu gewinnen und fundierte Entscheidungen zu treffen.
          </Text>
          <Text>
            Unser Fokus liegt auf der Erkennung von Anomalien und der frühzeitigen Identifikation potenzieller 
            Batteriefehler, um die Zuverlässigkeit und Lebensdauer von Batteriesystemen zu verbessern.
          </Text>
        </GridItem>
        <GridItem>
          <Box 
            borderRadius="lg" 
            overflow="hidden" 
            height="300px" 
            boxShadow="xl"
            bgColor="blue.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold" color="blue.500" fontSize="xl">
              Batterievisualisierung Illustration
            </Text>
            {/* Hier könnte ein passendes Bild eingefügt werden */}
          </Box>
        </GridItem>
      </Grid>

      {/* Schlüsselfunktionen */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Schlüsselfunktionen</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={4}>Interaktive Weltkarte</Heading>
            <Text>
              Visualisieren Sie Batterie-KPIs auf einer interaktiven Weltkarte, mit farblicher Hervorhebung 
              basierend auf ausgewählten Metriken und detaillierten Informationen bei Hover/Klick.
            </Text>
          </Box>
          
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={4}>Umfangreiche Filtermöglichkeiten</Heading>
            <Text>
              Filtern Sie Daten nach verschiedenen Kriterien wie Kontinent, Land, Klima, Modellserie 
              und technischen Parametern, um genau die Information zu finden, die Sie benötigen.
            </Text>
          </Box>
          
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={4}>KI-gestützte Datenabfragen</Heading>
            <Text>
              Nutzen Sie natürliche Sprachbefehle, um komplexe Datenabfragen durchzuführen - 
              unsere KI wandelt Ihre Anfragen in präzise SQL-Abfragen um und liefert die gewünschten Ergebnisse.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Technologie-Stack */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Unser Technologie-Stack</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
          <GridItem>
            <VStack spacing={4} align="flex-start">
              <Heading as="h3" size="md">Frontend</Heading>
              <HStack>
                <Badge colorScheme="blue" fontSize="0.9em" p={1}>React</Badge>
                <Badge colorScheme="blue" fontSize="0.9em" p={1}>Chakra UI</Badge>
              </HStack>
              <HStack>
                <Badge colorScheme="blue" fontSize="0.9em" p={1}>Mapbox GL JS</Badge>
                <Badge colorScheme="blue" fontSize="0.9em" p={1}>React Router</Badge>
              </HStack>
              <Text>
                Moderne, reaktive Benutzeroberfläche mit intuitiver Navigation und 
                leistungsstarken Visualisierungskomponenten.
              </Text>
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack spacing={4} align="flex-start">
              <Heading as="h3" size="md">Backend</Heading>
              <HStack>
                <Badge colorScheme="green" fontSize="0.9em" p={1}>Python</Badge>
                <Badge colorScheme="green" fontSize="0.9em" p={1}>Flask</Badge>
              </HStack>
              <HStack>
                <Badge colorScheme="green" fontSize="0.9em" p={1}>SQLAlchemy</Badge>
                <Badge colorScheme="green" fontSize="0.9em" p={1}>PostgreSQL</Badge>
              </HStack>
              <Text>
                Robustes Backend mit REST-API, effizienter Datenverarbeitung 
                und sicherer Speicherung in einer relationalen Datenbank.
              </Text>
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack spacing={4} align="flex-start">
              <Heading as="h3" size="md">KI & Datenanalyse</Heading>
              <HStack>
                <Badge colorScheme="purple" fontSize="0.9em" p={1}>OpenAI API</Badge>
                <Badge colorScheme="purple" fontSize="0.9em" p={1}>Pandas</Badge>
              </HStack>
              <HStack>
                <Badge colorScheme="purple" fontSize="0.9em" p={1}>NumPy</Badge>
                <Badge colorScheme="purple" fontSize="0.9em" p={1}>Jupyter</Badge>
              </HStack>
              <Text>
                Fortschrittliche KI-Integration für natürliche Sprachverarbeitung und
                leistungsstarke Tools zur Datenanalyse und -verarbeitung.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* Das Team */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Unser Team</Heading>
        <Text textAlign="center" mb={8}>
          BattInsight wird von einem engagierten Team von Entwicklern, Datenwissenschaftlern und Branchenexperten entwickelt, 
          die gemeinsam daran arbeiten, die besten Tools für die Analyse von Batteriedaten zu erstellen.
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <Box textAlign="center">
            <Box 
              borderRadius="full" 
              bg="gray.200" 
              width="150px" 
              height="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Text>Teammitglied 1</Text>
            </Box>
            <Heading as="h3" size="md">Max Mustermann</Heading>
            <Text color="gray.600">Lead Developer</Text>
          </Box>
          
          <Box textAlign="center">
            <Box 
              borderRadius="full" 
              bg="gray.200" 
              width="150px" 
              height="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Text>Teammitglied 2</Text>
            </Box>
            <Heading as="h3" size="md">Anna Schmidt</Heading>
            <Text color="gray.600">Data Scientist</Text>
          </Box>
          
          <Box textAlign="center">
            <Box 
              borderRadius="full" 
              bg="gray.200" 
              width="150px" 
              height="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Text>Teammitglied 3</Text>
            </Box>
            <Heading as="h3" size="md">Jan Müller</Heading>
            <Text color="gray.600">UX Designer</Text>
          </Box>
          
          <Box textAlign="center">
            <Box 
              borderRadius="full" 
              bg="gray.200" 
              width="150px" 
              height="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Text>Teammitglied 4</Text>
            </Box>
            <Heading as="h3" size="md">Laura Fischer</Heading>
            <Text color="gray.600">Battery Expert</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Partner & Kooperationen */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Partner & Kooperationen</Heading>
        <Text textAlign="center" mb={8}>
          Wir arbeiten mit führenden Unternehmen und Forschungseinrichtungen zusammen, 
          um die bestmöglichen Einblicke in Batteriedaten zu gewinnen.
        </Text>
        
        <Flex justifyContent="center" flexWrap="wrap" gap={8}>
          <Box width="150px" height="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
            Partner 1
          </Box>
          <Box width="150px" height="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
            Partner 2
          </Box>
          <Box width="150px" height="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
            Partner 3
          </Box>
          <Box width="150px" height="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
            Partner 4
          </Box>
        </Flex>
      </Box>

      <Divider my={10} />

      {/* Kontakt */}
      <Box textAlign="center">
        <Heading as="h2" size="lg" mb={4}>Kontaktieren Sie uns</Heading>
        <Text mb={4}>
          Haben Sie Fragen oder Anregungen zu BattInsight? Unser Team steht Ihnen gerne zur Verfügung.
        </Text>
        <Link href="#" color="blue.500" fontWeight="bold" display="inline-flex" alignItems="center">
          Kontakt aufnehmen <Icon as={ExternalLinkIcon} ml={1} />
        </Link>
      </Box>
    </Container>
  );
};

export default AboutPage; 
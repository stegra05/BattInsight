/* 
Ziel & Funktion:
	•	Dokumentationsseite für die BattInsight-Anwendung.
	•	Stellt umfangreiche Informationen über die Funktionen, Datenvisualisierung und API-Verwendung bereit.
	•	Bietet hilfreiche Anleitungen zur Nutzung der Anwendung.
Abhängigkeiten:
	•	Verwendet Chakra UI für das Layout und die Komponenten.
*/

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  List, 
  ListItem, 
  ListIcon, 
  Code, 
  Divider, 
  Container,
  Image,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const DocumentationPage = () => {
  return (
    <Container maxW="1200px" py={8}>
      <Heading as="h1" size="2xl" mb={6} textAlign="center">BattInsight Dokumentation</Heading>
      <Text fontSize="lg" mb={8}>
        Willkommen bei der umfassenden Dokumentation von BattInsight. Diese Seite bietet Ihnen alle Informationen, 
        die Sie benötigen, um die Funktionen und Möglichkeiten unserer Datenvisualisierungsplattform optimal zu nutzen.
      </Text>

      <Tabs isFitted variant="enclosed" colorScheme="blue" mb={12}>
        <TabList mb="1em">
          <Tab>Übersicht</Tab>
          <Tab>Datenvisualisierung</Tab>
          <Tab>KI-Abfragen</Tab>
          <Tab>API-Referenz</Tab>
          <Tab>Filteroptionen</Tab>
        </TabList>
        
        <TabPanels>
          {/* Übersicht */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={4}>Projektübersicht</Heading>
            <Text mb={4}>
              BattInsight bietet eine interaktive Plattform zur Visualisierung von Batterie-Daten, die aus CSV-Dateien importiert werden.
              Die Anwendung ermöglicht es, Anomalien und potenzielle Ausfälle in Batteriedaten zu erkennen und zu analysieren.
            </Text>
            
            <Heading as="h3" size="md" mb={3} mt={6}>Hauptfunktionen</Heading>
            <List spacing={3} mb={6}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Interaktive Weltkarte zur Visualisierung von Batterie-KPIs nach geografischen Regionen
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Umfangreiche Filteroptionen für Kontinent, Land, Klima, Modellserien und mehr
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                KI-gesteuerte Abfragen in natürlicher Sprache für komplexe Datenanalysen
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Detaillierte tabellarische Darstellung der gefilterten Daten
              </ListItem>
            </List>

            <Heading as="h3" size="md" mb={3}>Technischer Stack</Heading>
            <Box mb={6}>
              <Text fontWeight="bold" mb={2}>Frontend:</Text>
              <Text>React, Chakra UI, Mapbox GL JS</Text>
              
              <Text fontWeight="bold" mt={4} mb={2}>Backend:</Text>
              <Text>Python, Flask, SQLAlchemy, PostgreSQL</Text>
              
              <Text fontWeight="bold" mt={4} mb={2}>KI-Integration:</Text>
              <Text>OpenAI API für natürliche Sprachverarbeitung und SQL-Generierung</Text>
            </Box>
          </TabPanel>

          {/* Datenvisualisierung */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={4}>Datenvisualisierung</Heading>
            <Text mb={6}>
              BattInsight bietet leistungsstarke Visualisierungswerkzeuge, um komplexe Batteriedaten verständlich und 
              interaktiv darzustellen. Die Hauptfunktionen umfassen eine interaktive Weltkarte sowie detaillierte Tabellendarstellungen.
            </Text>

            <Heading as="h3" size="md" mb={3}>Interaktive Weltkarte</Heading>
            <Text mb={4}>
              Die Weltkarte zeigt Länder farblich hervorgehoben basierend auf den ausgewählten KPI-Werten. Je intensiver die Farbe, 
              desto höher der entsprechende Wert.
            </Text>
            <Text mb={6}>
              <strong>Interaktionsmöglichkeiten:</strong>
              <List mt={2} ml={4}>
                <ListItem>• Zoomen und Verschieben der Karte</ListItem>
                <ListItem>• Hover über Länder für Kurzinformationen</ListItem>
                <ListItem>• Klick auf Länder für detaillierte Daten</ListItem>
              </List>
            </Text>

            <Heading as="h3" size="md" mb={3}>Tabellendarstellung</Heading>
            <Text mb={4}>
              Die tabellarische Ansicht bietet eine detaillierte Darstellung aller gefilterten Daten mit den folgenden Funktionen:
            </Text>
            <List spacing={2} mb={6} ml={4}>
              <ListItem>• Sortierbare Spalten</ListItem>
              <ListItem>• Pagination für große Datensätze</ListItem>
              <ListItem>• Export-Möglichkeiten (CSV, Excel)</ListItem>
              <ListItem>• Anpassbare Spaltenauswahl</ListItem>
            </List>
          </TabPanel>

          {/* KI-Abfragen */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={4}>KI-gestützte Abfragen</Heading>
            <Text mb={6}>
              BattInsight nutzt die OpenAI API, um natürliche Sprachbefehle in SQL-Abfragen umzuwandeln. Diese innovative Funktion 
              ermöglicht es auch Benutzern ohne SQL-Kenntnisse, komplexe Datenabfragen durchzuführen.
            </Text>

            <Heading as="h3" size="md" mb={3}>So funktioniert es</Heading>
            <Text mb={4}>
              1. Geben Sie Ihre Anfrage in natürlicher Sprache in das Abfragefeld ein (z.B. "Zeige mir alle Batterien mit hohen Ausfallraten in kalten Klimazonen")
              <br />
              2. Die OpenAI API wandelt Ihre Anfrage in eine SQL-Abfrage um
              <br />
              3. Die Anwendung validiert die generierte SQL-Abfrage auf Sicherheit und korrekte Syntax
              <br />
              4. Die Abfrage wird ausgeführt und die Ergebnisse werden visualisiert
            </Text>

            <Heading as="h3" size="md" mb={3}>Beispielabfragen</Heading>
            <Accordion allowMultiple mb={6}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Einfache Filterung
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text mb={2}><strong>Natürliche Sprachfrage:</strong> "Zeige alle Batterien aus Deutschland"</Text>
                  <Code p={2} display="block" whiteSpace="pre" mb={2} borderRadius="md">
                    SELECT * FROM battery_data WHERE country = 'Germany';
                  </Code>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Komplexe Abfrage
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text mb={2}><strong>Natürliche Sprachfrage:</strong> "Zeige mir die Top 5 Länder mit den höchsten Batterieausfallraten für Modellserie XYZ"</Text>
                  <Code p={2} display="block" whiteSpace="pre" mb={2} borderRadius="md">
                    SELECT country, AVG(val) as average_failure_rate
                    FROM battery_data
                    WHERE model_series = 'XYZ' AND var = 'failure_rate'
                    GROUP BY country
                    ORDER BY average_failure_rate DESC
                    LIMIT 5;
                  </Code>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </TabPanel>

          {/* API-Referenz */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={4}>API-Referenz</Heading>
            <Text mb={6}>
              BattInsight bietet eine RESTful API, die es Entwicklern ermöglicht, direkt auf die Batteriedaten zuzugreifen 
              und in eigene Anwendungen zu integrieren.
            </Text>

            <Heading as="h3" size="md" mb={3}>Endpunkte</Heading>
            
            <Box mb={4} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">GET /api/data</Text>
              <Text mt={2} mb={2}>Ruft alle Batteriedaten ab, optional mit Filtern.</Text>
              <Text fontWeight="semibold">Parameter:</Text>
              <List ml={4}>
                <ListItem>• continent - Filtert nach Kontinent</ListItem>
                <ListItem>• country - Filtert nach Land</ListItem>
                <ListItem>• climate - Filtert nach Klimazone</ListItem>
                <ListItem>• model_series - Filtert nach Modellserie</ListItem>
                <ListItem>• var - Filtert nach Variable (z.B. 'failure_rate')</ListItem>
              </List>
            </Box>

            <Box mb={4} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">GET /api/stats</Text>
              <Text mt={2} mb={2}>Ruft aggregierte Statistiken zu den Batteriedaten ab.</Text>
              <Text fontWeight="semibold">Parameter:</Text>
              <List ml={4}>
                <ListItem>• group_by - Gruppierungskriterium (z.B. 'country', 'model_series')</ListItem>
                <ListItem>• metric - Statistische Methode (z.B. 'avg', 'max', 'min')</ListItem>
                <ListItem>• var - Zu analysierende Variable</ListItem>
              </List>
            </Box>

            <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">POST /api/ai_query</Text>
              <Text mt={2} mb={2}>Führt eine KI-generierte Abfrage basierend auf natürlicher Sprache aus.</Text>
              <Text fontWeight="semibold">Request Body:</Text>
              <Code p={2} display="block" whiteSpace="pre" mb={2} borderRadius="md">
{`{
  "query": "Zeige mir alle Batterien mit hoher Ausfallrate in Deutschland"
}`}
              </Code>
            </Box>

            <Heading as="h3" size="md" mb={3}>Authentifizierung</Heading>
            <Text mb={4}>
              Die API erfordert eine API-Schlüssel-Authentifizierung. Fügen Sie den API-Schlüssel als Header zu Ihren Anfragen hinzu:
            </Text>
            <Code p={2} display="block" whiteSpace="pre" mb={6} borderRadius="md">
              Authorization: Bearer YOUR_API_KEY
            </Code>
          </TabPanel>

          {/* Filteroptionen */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={4}>Filteroptionen</Heading>
            <Text mb={6}>
              BattInsight bietet umfangreiche Filtermöglichkeiten, um die Daten genau nach Ihren Bedürfnissen anzuzeigen. 
              Diese Sektion erklärt die verschiedenen Filteroptionen im Detail.
            </Text>

            <Heading as="h3" size="md" mb={3}>Geografische Filter</Heading>
            <List spacing={2} mb={6} ml={4}>
              <ListItem>• <strong>Kontinent:</strong> Filtern Sie Daten nach Kontinenten (Europa, Asien, Nordamerika, ...)</ListItem>
              <ListItem>• <strong>Land:</strong> Wählen Sie ein bestimmtes Land aus</ListItem>
              <ListItem>• <strong>Klimazone:</strong> Filtern nach verschiedenen Klimazonen (kalt, gemäßigt, tropisch, ...)</ListItem>
            </List>

            <Heading as="h3" size="md" mb={3}>Technische Filter</Heading>
            <List spacing={2} mb={6} ml={4}>
              <ListItem>• <strong>Modellserie:</strong> Filtern nach spezifischer Batteriemodellserie</ListItem>
              <ListItem>• <strong>battAlias:</strong> Filtern nach Batterie-Alias-Bezeichnung</ListItem>
              <ListItem>• <strong>Variable (var):</strong> Wählen Sie den zu analysierenden Parameter (z.B. Ausfallrate, Lebensdauer, Leistung)</ListItem>
            </List>

            <Heading as="h3" size="md" mb={3}>Numerische Filter</Heading>
            <Text mb={4}>
              Für numerische Werte (wie 'val') können Sie Wertebereiche mit Schiebereglern definieren:
            </Text>
            <List spacing={2} mb={6} ml={4}>
              <ListItem>• Minimaler Wert: Setzen Sie eine untere Grenze</ListItem>
              <ListItem>• Maximaler Wert: Setzen Sie eine obere Grenze</ListItem>
            </List>

            <Heading as="h3" size="md" mb={3}>Filter kombinieren</Heading>
            <Text mb={4}>
              Sie können mehrere Filter gleichzeitig anwenden, um sehr spezifische Datensätze zu erhalten. Die Anwendung führt
              dabei automatisch eine UND-Verknüpfung der verschiedenen Filter durch.
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider my={10} />

      <Box textAlign="center" p={4}>
        <Heading as="h2" size="lg" mb={6}>Benötigen Sie weitere Hilfe?</Heading>
        <Text mb={4}>
          Wenn Sie Fragen haben oder weitere Unterstützung benötigen, zögern Sie nicht,
          unser Support-Team zu kontaktieren oder prüfen Sie unsere ausführlichen Anleitungsvideos.
        </Text>
        <Link href="#" color="blue.500" fontWeight="bold">
          Kontaktieren Sie uns
        </Link>
      </Box>
    </Container>
  );
};

export default DocumentationPage; 
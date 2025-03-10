/* 
Ziel & Funktion:
	•	Kontaktseite für die BattInsight-Anwendung.
	•	Stellt ein Kontaktformular und Kontaktinformationen bereit.
	•	Bietet verschiedene Kontaktmöglichkeiten für Anfragen und Support.
Abhängigkeiten:
	•	Verwendet Chakra UI für das Layout und die Komponenten.
*/

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Select,
  Text,
  Textarea,
  Icon,
  useToast,
  VStack,
  HStack
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon, InfoIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-Mail-Format ist ungültig';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Betreff ist erforderlich';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Nachricht ist erforderlich';
    }
    if (!formData.category) {
      newErrors.category = 'Bitte wählen Sie eine Kategorie';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simuliere API-Aufruf für Kontaktformular
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Nachricht gesendet",
          description: "Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: ''
        });
      }, 1500);
    }
  };

  return (
    <Container maxW="1200px" py={8}>
      <Box textAlign="center" mb={12}>
        <Heading as="h1" size="2xl" mb={4}>Kontakt</Heading>
        <Text fontSize="lg" maxW="700px" mx="auto">
          Haben Sie Fragen zu BattInsight oder benötigen Sie Unterstützung? 
          Unser Team steht Ihnen gerne zur Verfügung.
        </Text>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} mb={16}>
        {/* Kontaktformular */}
        <GridItem>
          <Box as="form" onSubmit={handleSubmit} p={6} borderWidth="1px" borderRadius="lg" shadow="md">
            <Heading as="h2" size="lg" mb={6}>Schreiben Sie uns</Heading>
            
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Ihr Name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">E-Mail</FormLabel>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Ihre E-Mail-Adresse"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.category}>
                <FormLabel htmlFor="category">Kategorie</FormLabel>
                <Select 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="Wählen Sie eine Kategorie"
                >
                  <option value="general">Allgemeine Anfrage</option>
                  <option value="support">Technischer Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Kooperation / Partnerschaft</option>
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.subject}>
                <FormLabel htmlFor="subject">Betreff</FormLabel>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Betreff Ihrer Nachricht"
                />
                <FormErrorMessage>{errors.subject}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.message}>
                <FormLabel htmlFor="message">Nachricht</FormLabel>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Ihre Nachricht"
                  rows={6}
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                isLoading={isSubmitting}
                loadingText="Wird gesendet..."
                mt={4}
              >
                Nachricht senden
              </Button>
            </VStack>
          </Box>
        </GridItem>

        {/* Kontaktinformationen */}
        <GridItem>
          <VStack spacing={10} align="stretch">
            <Box>
              <Heading as="h2" size="lg" mb={6}>Kontaktinformationen</Heading>
              
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Icon as={EmailIcon} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">E-Mail</Text>
                    <Link href="mailto:info@battinsight.de" color="blue.500">
                      info@battinsight.de
                    </Link>
                  </Box>
                </HStack>
                
                <HStack spacing={4}>
                  <Icon as={PhoneIcon} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">Telefon</Text>
                    <Link href="tel:+491234567890" color="blue.500">
                      +49 (0) 123 456 7890
                    </Link>
                  </Box>
                </HStack>
                
                <HStack spacing={4} align="flex-start">
                  <Icon as={FaMapMarkerAlt} boxSize={6} color="blue.500" mt={1} />
                  <Box>
                    <Text fontWeight="bold">Adresse</Text>
                    <Text>BattInsight GmbH</Text>
                    <Text>Musterstraße 123</Text>
                    <Text>12345 Musterstadt</Text>
                    <Text>Deutschland</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
            
            <Divider />
            
            <Box>
              <Heading as="h3" size="md" mb={4}>Geschäftszeiten</Heading>
              <VStack spacing={2} align="stretch">
                <Flex justify="space-between">
                  <Text>Montag - Freitag:</Text>
                  <Text>9:00 - 17:00 Uhr</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Samstag & Sonntag:</Text>
                  <Text>Geschlossen</Text>
                </Flex>
              </VStack>
            </Box>
            
            <Divider />
            
            <Box>
              <Heading as="h3" size="md" mb={4}>Schnelle Hilfe</Heading>
              <Text mb={4}>
                Für dringende Anfragen können Sie unser Support-Team direkt kontaktieren:
              </Text>
              <HStack spacing={4}>
                <Icon as={InfoIcon} boxSize={6} color="blue.500" />
                <Box>
                  <Text fontWeight="bold">Support</Text>
                  <Link href="mailto:support@battinsight.de" color="blue.500">
                    support@battinsight.de
                  </Link>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      {/* FAQ-Sektion */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Häufig gestellte Fragen</Heading>
        
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
          <Box p={5} borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>Wie kann ich BattInsight testen?</Heading>
            <Text>
              Sie können BattInsight gerne für einen kostenlosen Testzeitraum von 30 Tagen nutzen. 
              Bitte kontaktieren Sie unser Vertriebsteam, um Zugang zu erhalten.
            </Text>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>Gibt es eine API-Dokumentation?</Heading>
            <Text>
              Ja, wir bieten eine vollständige API-Dokumentation an. Sie finden diese im 
              Dokumentationsbereich unserer Website.
            </Text>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>Kann ich eigene Daten importieren?</Heading>
            <Text>
              Ja, BattInsight ermöglicht den Import eigener CSV-Dateien. Die Daten müssen jedoch 
              im von uns spezifizierten Format vorliegen.
            </Text>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="md">
            <Heading as="h3" size="md" mb={3}>Wie sicher sind meine Daten?</Heading>
            <Text>
              Die Sicherheit Ihrer Daten hat für uns höchste Priorität. Wir verwenden 
              Industriestandard-Verschlüsselung und sichere Speicherverfahren.
            </Text>
          </Box>
        </Grid>
      </Box>

      {/* Karte / Standort */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">Unser Standort</Heading>
        <Box 
          height="400px" 
          borderRadius="lg" 
          overflow="hidden"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg" color="gray.600">
            Hier würde eine Kartenansicht unseres Standorts angezeigt werden
          </Text>
          {/* Hier könnte eine Mapbox- oder Google Maps-Integration erfolgen */}
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage; 
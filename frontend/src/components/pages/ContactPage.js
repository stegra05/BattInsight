import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * ContactPage component - contact form and information
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: "We've received your message and will get back to you soon.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <Heading as="h1" size="xl" mb={6}>
        Contact Us
      </Heading>
      
      <Text fontSize="lg" mb={8}>
        Have questions about BattInsight? We're here to help! Fill out the form below or use our contact information to get in touch.
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Contact Form */}
        <Box
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <Heading as="h2" size="lg" mb={6}>
            Send us a message
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Your Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </FormControl>
              
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                />
              </FormControl>
              
              <FormControl id="subject" isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                />
              </FormControl>
              
              <FormControl id="message" isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  size="md"
                  rows={6}
                />
              </FormControl>
              
              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                size="lg"
                width="full"
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
        
        {/* Contact Information */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Contact Information
          </Heading>
          
          <VStack spacing={8} align="stretch">
            <ContactInfo
              icon={FaEnvelope}
              title="Email"
              content="info@battinsight.com"
              subtitle="We'll respond within 24 hours"
            />
            
            <ContactInfo
              icon={FaPhone}
              title="Phone"
              content="+1 (555) 123-4567"
              subtitle="Monday-Friday, 9AM-5PM EST"
            />
            
            <ContactInfo
              icon={FaMapMarkerAlt}
              title="Office"
              content="123 Battery Street, Tech City, CA 94111"
              subtitle="Come visit us!"
            />
            
            <Box
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="md"
              mt={6}
            >
              <Heading as="h3" size="md" mb={4}>
                Technical Support
              </Heading>
              <Text mb={2}>
                For technical issues or bug reports, please email:
              </Text>
              <Text fontWeight="bold" color="blue.500">
                support@battinsight.com
              </Text>
              <Text mt={4} fontSize="sm" color="gray.500">
                Please include as much detail as possible, including screenshots if applicable.
              </Text>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>
      
      {/* FAQ Section */}
      <Box mt={16}>
        <Heading as="h2" size="lg" mb={6}>
          Frequently Asked Questions
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <FAQ
            question="How can I get access to BattInsight?"
            answer="BattInsight is currently available to registered users. Please contact our sales team at sales@battinsight.com to request access."
          />
          
          <FAQ
            question="Is there a free trial available?"
            answer="Yes, we offer a 14-day free trial with full access to all features. No credit card required."
          />
          
          <FAQ
            question="Can I export the data for my own analysis?"
            answer="Absolutely! BattInsight allows you to export data in CSV, JSON, and Excel formats for further analysis in your preferred tools."
          />
          
          <FAQ
            question="Do you offer custom integrations?"
            answer="Yes, we can develop custom integrations with your existing systems. Please contact our sales team to discuss your requirements."
          />
        </SimpleGrid>
      </Box>
    </Container>
  );
};

// ContactInfo component for displaying contact information
const ContactInfo = ({ icon, title, content, subtitle }) => {
  return (
    <HStack spacing={4} align="flex-start">
      <Box
        p={2}
        bg="blue.500"
        borderRadius="md"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} boxSize={6} />
      </Box>
      <Box>
        <Heading as="h3" size="md">
          {title}
        </Heading>
        <Text fontWeight="bold" mt={1}>
          {content}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {subtitle}
        </Text>
      </Box>
    </HStack>
  );
};

// FAQ component for displaying frequently asked questions
const FAQ = ({ question, answer }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Heading as="h3" size="md" mb={2}>
        {question}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {answer}
      </Text>
    </Box>
  );
};

export default ContactPage;

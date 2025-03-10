/*
Ziel & Funktion:
	•	Stellt den Fußbereich der Anwendung dar.
	•	Enthält Copyright-Informationen, Links und ggf. weitere Informationen.
Abhängigkeiten:
	•	Verwendet Chakra UI für das Styling.
*/

import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© {new Date().getFullYear()} BattInsight. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'}>Home</Link>
          <Link href={'#'}>About</Link>
          <Link href={'#'}>Privacy</Link>
          <Link href={'#'}>Terms</Link>
        </Stack>
      </Container>
    </Box>
  );
} 
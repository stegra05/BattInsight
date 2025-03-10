/* 
Ziel & Funktion:
	•	Die oberste React-Komponente, die den Rahmen der Anwendung bildet.
	•	Kann Routing-Logik beinhalten und integriert andere wesentliche Komponenten (z. B. HomePage).
Abhängigkeiten:
	•	Importiert Komponenten wie HomePage und eventuell globale Layout-Komponenten.
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import HomePage from './HomePage';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  return (
    <Router>
      <Flex direction="column" minH="100vh">
        <Header />
        <Box flex="1" px={4} py={8} maxW="1400px" mx="auto" w="100%">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Box>
        <Footer />
      </Flex>
    </Router>
  );
};

export default App;
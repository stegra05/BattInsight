/* 
Ziel & Funktion:
	•	Einstiegspunkt der React-Anwendung.
	•	Rendert die Hauptkomponente (z. B. <App />) in das DOM, das in der index.html definiert ist.
Abhängigkeiten:
	•	Importiert die Hauptkomponente aus components/App.js und setzt globale Konfigurationen.
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './components/App';
import './styles/index.css';

// Extend the Chakra UI theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80cbff',
      300: '#4db6ff',
      400: '#1aa1ff',
      500: '#0087e6',
      600: '#0069b3',
      700: '#004c80',
      800: '#002e4d',
      900: '#00101a',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
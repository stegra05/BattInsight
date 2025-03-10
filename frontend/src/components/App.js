import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import theme from '../styles/theme';

// Import common components
import Header from './common/Header';
import Footer from './common/Footer';
import Loading from './common/Loading';

// Import page components
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './pages/DocumentationPage';
import ContactPage from './pages/ContactPage';

/**
 * Main App component that sets up routing and global providers
 */
const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Box minHeight="100vh" display="flex" flexDirection="column">
          <Header />
          <Box flex="1" as="main" py={8} px={4}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/documentation" component={DocumentationPage} />
              <Route path="/contact" component={ContactPage} />
            </Switch>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;

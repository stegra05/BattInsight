import React from 'react';
import { extendTheme } from '@chakra-ui/react';

// Define the color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Define the colors
const colors = {
  brand: {
    50: '#e6f6ff',
    100: '#b3e0ff',
    200: '#80cbff',
    300: '#4db5ff',
    400: '#1a9fff',
    500: '#0080e6',
    600: '#0066b3',
    700: '#004d80',
    800: '#00334d',
    900: '#001a26',
  },
};

// Define the fonts
const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Inter", sans-serif',
};

// Define the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        lineHeight: 'shorter',
      },
    },
  },
});

export default theme;

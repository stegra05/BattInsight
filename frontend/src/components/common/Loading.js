import React from 'react';
import { Spinner, Flex, Text, Box } from '@chakra-ui/react';

/**
 * Loading component to display during async operations
 */
const Loading = ({ text = 'Loading...', size = 'xl', color = 'blue.500' }) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="200px"
      width="100%"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={color}
        size={size}
      />
      <Box mt={4}>
        <Text fontSize="lg" color="gray.600">
          {text}
        </Text>
      </Box>
    </Flex>
  );
};

export default Loading;

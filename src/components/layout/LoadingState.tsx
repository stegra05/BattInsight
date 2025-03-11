import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div 
        className="w-16 h-16 rounded-full animate-spin"
        style={{
          border: '4px solid rgba(156, 163, 175, 0.2)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%'
        }}
      ></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingState; 
import React from 'react';
import Card from '../ui/Card';

interface LoadingStateProps {
  message?: string;
  showCard?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading data...', 
  showCard = true 
}) => {
  const loadingContent = (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer pulse effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse-blue"></div>
        
        {/* Main spinner */}
        <div 
          className="w-16 h-16 rounded-full animate-spin relative"
          style={{
            border: '3px solid rgba(219, 234, 254, 0.3)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%'
          }}
        ></div>
        
        {/* Inner blue dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
        <p className="mt-1 text-gray-500 dark:text-gray-500 text-sm animate-pulse">Please wait</p>
      </div>
    </div>
  );

  return showCard ? (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      {loadingContent}
    </Card>
  ) : (
    loadingContent
  );
};

export default LoadingState; 
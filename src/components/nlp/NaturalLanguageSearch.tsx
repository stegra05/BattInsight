import React, { useState } from 'react';

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => void;
  isProcessing: boolean;
  lastQuery?: string;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onSearch,
  isProcessing,
  lastQuery
}) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query.trim());
    }
  };

  const exampleQueries = [
    "Show data points with value greater than 80",
    "Find all data in Europe",
    "Compare values across different continents",
    "Show only Temperate climate data"
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Natural Language Search</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Search data using natural language queries</p>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Show data points with value greater than 80'"
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !query.trim()}
              className={`px-4 py-2 rounded-r-md text-white ${
                isProcessing || !query.trim()
                  ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>
        
        {lastQuery && (
          <div className="mb-4 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Last query:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400 italic">{lastQuery}</span>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example queries:</h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={isProcessing}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageSearch; 
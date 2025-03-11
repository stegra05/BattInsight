import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { DataPoint } from '../../services/DataService';

interface DataChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  dataKey?: string;
  loading: boolean;
  title: string;
  description?: string;
}

const DataChart: React.FC<DataChartProps> = ({ 
  data,
  type = 'bar',
  dataKey = 'value',
  loading,
  title,
  description
}) => {
  // Colors for charts
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#14b8a6', // teal
  ];

  // Debug logging to track data and component state
  React.useEffect(() => {
    console.log(`DataChart [${title}] render:`, { 
      data: data ? `${data.length} items` : 'no data', 
      type, 
      loading 
    });
    if (data && data.length > 0) {
      console.log(`DataChart [${title}] sample data:`, data[0]);
    }
  }, [data, type, title, loading]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 h-80 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 h-80 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="mt-3 text-gray-600 dark:text-gray-400">No data available to display</p>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  // Prepare chart data based on chart type
  const prepareChartData = useMemo(() => {
    console.log(`DataChart [${title}] preparing data for ${type} chart`);
    
    if (type === 'pie') {
      // Group by continent for pie chart
      const grouped: Record<string, number> = {};
      data.forEach(point => {
        if (point.continent) {
          grouped[point.continent] = (grouped[point.continent] || 0) + (point.value || 0);
        }
      });
      
      const result = Object.keys(grouped).map(key => ({
        name: key,
        value: grouped[key]
      }));
      
      console.log(`DataChart [${title}] pie data prepared:`, result);
      return result;
    }
    
    // Ensure data points have required properties for bar/line charts
    const validData = data.filter(point => 
      point && 
      typeof point.value === 'number' && 
      point.country
    );
    
    console.log(`DataChart [${title}] valid data: ${validData.length}/${data.length}`);
    
    // For bar and line charts, keep original data but limit to 10 points if too many
    return validData.length > 10 ? validData.slice(0, 10) : validData;
  }, [data, type, title]);

  // Render the appropriate chart based on type
  const renderChart = () => {
    if (!prepareChartData || prepareChartData.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>Unable to render chart with the current data</p>
        </div>
      );
    }
    
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                strokeWidth={2} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {prepareChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Value']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]}>
                {prepareChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      
      <div className="p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default DataChart; 
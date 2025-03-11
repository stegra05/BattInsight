import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DataPoint } from '../../services/DataService';

interface MapVisualizationProps {
  data: DataPoint[];
  loading: boolean;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ data, loading }) => {
  // Default center coordinates
  const defaultCenter = [20, 0];
  const defaultZoom = 2;

  // Function to determine circle color based on value
  const getMarkerColor = (value: number): string => {
    if (value >= 90) return '#ef4444'; // red
    if (value >= 75) return '#f97316'; // orange
    if (value >= 60) return '#facc15'; // yellow
    if (value >= 40) return '#a3e635'; // lime
    return '#22c55e'; // green
  };

  // Function to determine circle size based on value
  const getMarkerRadius = (value: number): number => {
    return Math.max(4, Math.min(10, value / 10));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Geographic Distribution</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Interactive map of data points</p>
      </div>
      
      <div className="h-96 z-0">
        <MapContainer 
          center={defaultCenter as [number, number]} 
          zoom={defaultZoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {data.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={getMarkerRadius(point.value)}
              pathOptions={{
                fillColor: getMarkerColor(point.value),
                fillOpacity: 0.7,
                weight: 1,
                color: '#ffffff',
                opacity: 0.8
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{point.country}</div>
                  <div>Continent: {point.continent}</div>
                  <div>Climate: {point.climate}</div>
                  <div>Value: {point.value}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapVisualization; 
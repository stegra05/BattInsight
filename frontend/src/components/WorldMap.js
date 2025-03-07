import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getBatteryFailures } from '../api/API';

/*
Zweck: Zeigt die interaktive Weltkarte mit Leaflet.js.
Funktionen:
	•	Stellt eine Leaflet-Karte dar.
	•	Zeigt Batterieausfälle pro Land farbkodiert an.
	•	Aktualisiert sich basierend auf Nutzerfiltern.
Abhängigkeiten:
	•	Leaflet.js für Kartenvisualisierung.
	•	API.js für Datenabruf.
*/

const WorldMap = ({ filters }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);

    useEffect(() => {
        // Only initialize if map doesn't exist
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: [20, 0],
                zoom: 2,
                className: 'dark:invert' // Invert colors for dark mode
            });

            // Dark mode tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                className: 'dark:invert' // Invert map tiles in dark mode
            }).addTo(mapInstanceRef.current);

            // Erstelle eine Layer-Gruppe für Marker
            markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array since we only want to initialize once

    // Aktualisiere die Marker, wenn sich die Filter ändern
    useEffect(() => {
        if (mapInstanceRef.current && filters) {
            setIsLoading(true);
            setError(null);
            
            getBatteryFailures(filters)
                .then(data => {
                    if (!data || data.length === 0) {
                        console.log('No data received from API');
                        return;
                    }

                    // Entferne vorhandene Marker
                    markersLayerRef.current.clearLayers();

                    // Gehe davon aus, dass data ein Array von Objekten ist, z.B.:
                    // { country, lat, lng, failures }
                    data.forEach(item => {
                        // Bestimme die Farbe basierend auf der Anzahl der Ausfälle
                        let color = 'green';
                        if (item.failures > 50) {
                            color = 'red';
                        } else if (item.failures > 20) {
                            color = 'orange';
                        }

                        // Erstelle einen Kreis-Marker
                        const marker = L.circleMarker([item.lat, item.lng], {
                            radius: 10,
                            fillColor: color,
                            color: color,
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.6
                        });

                        // Binde ein Popup an den Marker
                        marker.bindPopup(`<strong>${item.country}</strong><br/>Fehler: ${item.failures}`);

                        // Füge den Marker der Layer-Gruppe hinzu
                        markersLayerRef.current.addLayer(marker);
                    });
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                    setError('Failed to load battery failure data');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [filters]);

    return (
        <div className="bg-dark-surface rounded-lg shadow-lg p-4 h-[80vh] relative">
            {isLoading && (
                <div className="absolute inset-0 bg-dark-background/50 flex items-center justify-center z-10">
                    <div className="text-dark-text">Loading data...</div>
                </div>
            )}
            {error && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
                    {error}
                </div>
            )}
            <div 
                ref={mapRef} 
                className="h-full w-full rounded-lg overflow-hidden border border-dark-secondary"
            />
        </div>
    );
};

export default WorldMap;
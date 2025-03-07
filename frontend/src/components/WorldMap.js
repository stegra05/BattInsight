import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import API from '../api/API';

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
    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

    // Initialisiere die Karte beim ersten Rendern
    useEffect(() => {
        // Erstelle die Karte in dem Element mit der ID 'map'
        mapRef.current = L.map('map', {
            center: [20, 0], // Weltweite Zentrierung
            zoom: 2
        });

        // Füge einen OpenStreetMap-Kachel-Layer hinzu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors'
        }).addTo(mapRef.current);

        // Erstelle eine Layer-Gruppe für Marker
        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }, []);

    // Aktualisiere die Marker, wenn sich die Filter ändern
    useEffect(() => {
        // Hole die Batterieausfälle basierend auf den aktuellen Filtern
        API.getBatteryFailures(filters)
            .then(data => {
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
            .catch(error => console.error('Error fetching battery failures:', error));
    }, [filters]);

    return (
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
    );
};

export default WorldMap;
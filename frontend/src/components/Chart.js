/* 
Zweck: Stellt eine grafische Darstellung der Batterieausfälle als Balkendiagramm oder Liniendiagramm bereit.
Funktionen:
	•	Visualisiert Batterieausfalldaten für ein Land oder global.
	•	Unterstützt verschiedene Diagrammtypen (z. B. Balkendiagramm für Länder, Liniendiagramm für Zeitverläufe).
	•	Passt sich dynamisch an Filterauswahl des Nutzers an.
	•	Nutzt Animationen für ansprechende Darstellung.
Abhängigkeiten:
	•	chart.js für Diagramm-Rendering.
	•	API.js für den Abruf von Batterieausfalldaten.
	•	Filter.js für Filteroptionen.
	•	Wird in Home.js eingebunden, um zusätzliche Visualisierungen zur Karte bereitzustellen.
*/

import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { getAllData, getByCountry } from '../api/API';
import 'chart.js/auto';

const Chart = ({ country, chartType: propChartType, filters }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (country) {
                    data = await getByCountry(country);
                } else {
                    data = await getAllData();
                }
                
                // Bestimme den Diagrammtyp: wenn prop übergeben, nutze diesen, ansonsten 'line' für Länderdaten, 'bar' global
                const chartType = propChartType || (country ? 'line' : 'bar');
                let labels = [];
                let dataset = [];
                
                if (chartType === 'line') {
                    // Für Zeitverläufe: Annahme: data ist ein Array von Objekten mit 'date' und 'failures'
                    data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    labels = data.map(item => item.date);
                    dataset = data.map(item => item.failures);
                } else if (chartType === 'bar') {
                    // Für Länder: Annahme: data ist ein Array von Objekten mit 'country' und 'failures'
                    labels = data.map(item => item.country);
                    dataset = data.map(item => item.failures);
                }

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Batterieausfälle',
                            data: dataset,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1,
                        },
                    ],
                });
                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Chart-Daten:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [country, propChartType, filters]);

    if (loading) {
        return <div>Lade Diagramm...</div>;
    }

    const chartType = propChartType || (country ? 'line' : 'bar');

    return (
        <div>
            {chartType === 'line' ? (
                <Line data={chartData} options={{ responsive: true, animation: { duration: 1000 } }} />
            ) : (
                <Bar data={chartData} options={{ responsive: true, animation: { duration: 1000 } }} />
            )}
        </div>
    );
};

export default Chart;
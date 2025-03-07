import React, { useState, useEffect } from 'react';
import API from '../api/API';

/*
Zweck: Bietet eine Benutzeroberfläche zur Filterung der dargestellten Daten.
Funktionen:
	•	Ermöglicht die Auswahl eines Landes aus einer Dropdown-Liste.
	•	Ermöglicht das Filtern nach Batterieart.
	•	Aktualisiert WorldMap.js und Chart.js basierend auf der Auswahl.
	•	Stellt UI-Komponenten wie Dropdowns, Schieberegler oder Buttons bereit.
Abhängigkeiten:
	•	API.js für die Liste der verfügbaren Länder und Batteriearten.
	•	Wird in Home.js genutzt, um die Filter in die Benutzeroberfläche einzubinden.
	•	Interagiert mit WorldMap.js und Chart.js, um gefilterte Daten anzuzeigen.
*/

const Filter = ({ onFilterChange }) => {
    const [countries, setCountries] = useState([]);
    const [batteryTypes, setBatteryTypes] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedBatteryType, setSelectedBatteryType] = useState('');

    useEffect(() => {
        API.getCountries()
            .then(data => setCountries(data))
            .catch(error => console.error('Error fetching countries:', error));

        API.getBatteryTypes()
            .then(data => setBatteryTypes(data))
            .catch(error => console.error('Error fetching battery types:', error));
    }, []);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                country: selectedCountry,
                batteryType: selectedBatteryType,
            });
        }
    }, [selectedCountry, selectedBatteryType, onFilterChange]);

    return (
        <div className="filter-container">
            <div className="filter-item">
                <label htmlFor="country-select">Land auswählen:</label>
                <select
                    id="country-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                >
                    <option value="">Alle Länder</option>
                    {countries.map(country => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filter-item">
                <label htmlFor="battery-select">Batterieart filtern:</label>
                <select
                    id="battery-select"
                    value={selectedBatteryType}
                    onChange={(e) => setSelectedBatteryType(e.target.value)}
                >
                    <option value="">Alle Batteriearten</option>
                    {batteryTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Filter;
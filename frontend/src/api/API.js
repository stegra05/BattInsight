/* 
Zweck: Stellt Funktionen für API-Abfragen bereit.
Funktionen:
	•	getAllData(): Holt alle Batterieausfälle.
	•	getByCountry(country): Holt Daten für ein bestimmtes Land.
	•	getFilters(): Holt Filteroptionen für Länder/Batterietypen.
Abhängigkeiten:
	•	axios für HTTP-Anfragen.
	•	data_routes.py im Backend.
*/

import axios from 'axios';

// Basis-URL der API. Diese kann über die Umgebungsvariable REACT_APP_API_URL überschrieben werden.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Holt alle Batterieausfälle
 * @returns {Promise<Object>} Antwortdaten der API
 */
export const getAllData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Laden aller Batterieausfälle:', error);
        throw error;
    }
};

/**
 * Holt Daten für ein bestimmtes Land
 * @param {string} country - Das Land, für das Daten abgerufen werden sollen
 * @returns {Promise<Object>} Antwortdaten der API
 */
export const getByCountry = async (country) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/${country}`);
        return response.data;
    } catch (error) {
        console.error(`Fehler beim Laden der Daten für ${country}:`, error);
        throw error;
    }
};

/**
 * Holt Filteroptionen für Länder und Batterietypen
 * @returns {Promise<Object>} Antwortdaten der API
 */
export const getFilters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/filters`);
        return response.data;
    } catch (error) {
        console.error('Fehler beim Laden der Filteroptionen:', error);
        throw error;
    }
};
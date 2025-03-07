/*
 * Zweck: Enthält Hilfsfunktionen für das Frontend.
 * Funktionen:
 *   • Normalisiert API-Daten.
 *   • Berechnet Farbskalen für die Kartenansicht.
 * Abhängigkeiten:
 *   • Wird von WorldMap.js verwendet.
 */

/**
 * Normalisiert die von der API gelieferten Daten in ein einheitliches Format.
 * Erwartet wird ein Array von Objekten, z.B. mit den Eigenschaften:
 *   - id
 *   - latitude
 *   - longitude
 *   - battery_level
 *   - timestamp
 *
 * Das Normalisierungsformat:
 *   {
 *     id: <ID>,
 *     position: { lat: <latitude>, lng: <longitude> },
 *     value: <battery_level>,
 *     timestamp: <timestamp>
 *   }
 *
 * @param {Array} apiData - Rohdaten von der API
 * @returns {Array} Array der normalisierten Daten
 */
export function normalizeData(apiData) {
  if (!Array.isArray(apiData)) {
    console.error('Erwartet ein Array von API-Daten');
    return [];
  }

  return apiData.map(item => {
    return {
      id: item.id,
      position: {
        lat: item.latitude,
        lng: item.longitude
      },
      value: item.battery_level,
      timestamp: item.timestamp
    };
  });
}

/**
 * Berechnet eine Farbskala basierend auf den Werten der normalisierten Daten.
 * Die Farbskala interpoliert linear zwischen Grün (#00FF00) für niedrige Werte und Rot (#FF0000) für hohe Werte.
 *
 * @param {Array} data - Array von normalisierten Daten, die eine Eigenschaft "value" enthalten
 * @returns {Function} Eine Funktion, die einen Wert entgegennimmt und einen Hex-Farbcode zurückgibt
 */
export function calculateColorScale(data) {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Erwartet ein nicht-leeres Array von Daten');
    return () => '#00FF00';
  }

  const values = data.map(item => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Falls alle Werte gleich sind, gib eine konstante Funktion zurück
  if (min === max) {
    return () => '#00FF00';
  }

  // Rückgabe einer Funktion, die einen Wert in einen Farbcode interpoliert
  return function(value) {
    // Normalisierungsfaktor
    const t = (value - min) / (max - min);
    // Interpolation zwischen Grün (#00FF00) und Rot (#FF0000)
    // Grün: rgb(0, 255, 0), Rot: rgb(255, 0, 0)
    const red = Math.round(t * 255);
    const green = Math.round((1 - t) * 255);
    const blue = 0;
    
    // Konvertiere in Hexadezimalformat
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
  };
}

// Falls weitere Hilfsfunktionen benötigt werden, können diese hier ergänzt werden.
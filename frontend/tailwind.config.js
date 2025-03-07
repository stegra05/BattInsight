/* 
Zweck: Konfiguriert Tailwind CSS für das Frontend.
Funktionen:
	•	Definiert eigene Farbpaletten für die Kartenvisualisierung.
	•	Legt Breakpoints für responsive Designs fest.
	•	Erweitert Standardklassen für spezifische UI-Anforderungen.
	•	Optimiert CSS für bessere Performance im Produktionsmodus.
Abhängigkeiten:
	•	Wird von allen React-Komponenten genutzt, um ein einheitliches Design zu gewährleisten.
	•	Muss in package.json als Tailwind-Dependency installiert sein.
	•	Wird in index.css oder App.js eingebunden.
*/

module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}", // Alle React-Komponenten
	  // Optional kann auch "./public/index.html" hinzugefügt werden, falls benötigt.
	],
	theme: {
	  extend: {
		colors: {
		  // Eigene Farbpaletten für die Kartenvisualisierung
		  'card-primary': '#1E3A8A', // Beispiel: dunkles Blau
		  'card-secondary': '#F59E0B', // Beispiel: warmes Amber
		},
		screens: {
		  // Breakpoints für responsive Designs
		  'sm': '640px',
		  'md': '768px',
		  'lg': '1024px',
		  'xl': '1280px',
		  '2xl': '1536px',
		},
	  },
	},
	plugins: [],
  };
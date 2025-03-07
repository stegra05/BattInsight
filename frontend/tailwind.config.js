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
	  "./public/index.html" // Optional kann auch "./public/index.html" hinzugefügt werden, falls benötigt.
	],
	darkMode: 'class', // Enable dark mode
	theme: {
	  extend: {
		colors: {
		  primary: '#2D7DD2',
		  success: '#34C759',
		  warning: '#FFCC00',
		  danger: '#FF3B30',
		  gray: {
			light: '#F4F6F8',
			default: '#6B778C',
		  },
		  surface: {
			light: '#ffffff',
			dark: '#1a1a1a',
		  },
		  background: {
			light: '#F4F6F8',
			dark: '#111111',
		  }
		},
		fontFamily: {
		  sans: ['Inter', 'system-ui', 'sans-serif'],
		  display: ['Montserrat', 'system-ui', 'sans-serif'],
		},
		fontSize: {
		  'heading-1': ['32px', '1.2'],
		  'heading-2': ['24px', '1.3'],
		  'heading-3': ['20px', '1.4'],
		  'body': ['16px', '1.5'],
		},
		boxShadow: {
		  'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
		  'header': '0 2px 4px rgba(0, 0, 0, 0.05)',
		},
		screens: {
		  // Breakpoints für responsive Designs
		  'sm': '640px',
		  'md': '768px',
		  'lg': '1024px',
		  'xl': '1280px',
		  '2xl': '1536px',
		},
		height: {
		  'map': '70vh'
		}
	  },
	},
	plugins: [],
  };
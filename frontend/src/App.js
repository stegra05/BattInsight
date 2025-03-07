/* 
 * Zweck: Hauptkomponente der Anwendung.
 * Funktionen:
 *   • Definiert die Hauptstruktur der App.
 *   • Lädt WorldMap.js zur Datenvisualisierung.
 * Abhängigkeiten:
 *   • WorldMap.js für die Kartenansicht.
 *   • API.js für Backend-Abfragen.
 *   • React-Router für die Navigation.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import WorldMap from './components/WorldMap';
import AboutPage from './pages/AboutPage';
import FilterBar from './components/FilterBar';

// Remove the broken import and use Unicode symbols instead
// import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

function App() {
  const [data, setData] = React.useState([]);
  const [filter, setFilter] = React.useState({});
  const [darkMode, setDarkMode] = React.useState(true);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/filter/v1/battery-performance/country`)
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.entries(data).map(([country, value]) => ({
          country,
          failures: value.total || 0
        }));
        setData(formattedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [filter]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 
        ${darkMode ? 'dark bg-background-dark' : 'bg-background-light'}`}>
        <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark shadow-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="font-display text-heading-2 font-bold text-primary dark:text-primary">
                Battery Failure Visualization
              </h1>
              <div className="flex items-center gap-6">
                <nav>
                  <ul className="flex space-x-6">
                    <li><Link to="/" className="hover:text-primary-500 transition-colors">Map</Link></li>
                    <li><Link to="/about" className="hover:text-primary-500 transition-colors">About</Link></li>
                  </ul>
                </nav>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 mb-6 lg:mb-0">
              <FilterBar setFilter={setFilter} darkMode={darkMode} />
            </div>
            <div className="lg:col-span-9">
              <Routes>
                <Route path="/" element={<WorldMap data={data} darkMode={darkMode} />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>

        <footer className="bg-surface-light dark:bg-surface-dark mt-auto border-t border-gray-light dark:border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="text-sm text-gray-default dark:text-gray-400 flex justify-between items-center">
              <p>© 2025 Battery Failure Visualization</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
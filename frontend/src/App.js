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
// Importiere API.js falls direkte Backend-Abfragen hier benötigt werden
// import API from './API';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-background text-dark-text">
        <header className="bg-dark-primary shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-4">Battery Failure Visualization</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-dark-accent transition-colors">Map</Link></li>
                <li><Link to="/about" className="hover:text-dark-accent transition-colors">About</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<WorldMap />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-dark-primary mt-auto">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>© 2025 Battery Failure Visualization</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
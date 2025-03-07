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
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import WorldMap from './components/WorldMap';
// Importiere API.js falls direkte Backend-Abfragen hier benötigt werden
// import API from './API';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Battery Failure Visualization</h1>
          <nav>
            <ul>
              <li><Link to="/">Map</Link></li>
              {/* Weitere Navigationslinks können hier hinzugefügt werden */}
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route exact path="/">
              <WorldMap />
            </Route>
            {/* Weitere Routen können hier ergänzt werden */}
          </Switch>
        </main>
        <footer>
          <p>© 2025 Battery Failure Visualization</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
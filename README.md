<!-- This file contains the project description, features, requirements, tech stack, roadmap, and installation instructions for the Battery Failure Visualization project. -->

# Battery Failure Visualization

## Projektbeschreibung

Dieses Projekt zielt darauf ab, eine interaktive Weltkarte zu erstellen, die die Häufigkeit von Batterieausfällen nach Land visualisiert. Die Daten stammen aus einer CSV-Datei mit ca. 20.000 Einträgen und enthalten Informationen zu Batterieart, Ausfallhäufigkeit und Standort. Die Anwendung bietet Filtermöglichkeiten für Batteriearten und Länder sowie eine farbcodierte und numerische Darstellung der Daten.

---

## Features

- **Interaktive Weltkarte** zur Visualisierung von Batterieausfällen
- **Datenfilterung** nach Batterieart und Land
- **Farbcodierte Darstellung** der Ausfallhäufigkeit
- **Dynamische Aktualisierung** der Ansicht basierend auf Benutzerinteraktionen
- **REST API** zur Bereitstellung der Daten

---

## Anforderungen

### Funktionale Anforderungen

1. **Datenverarbeitung**
    - Einlesen einer CSV-Datei mit Batterieausfalldaten
    - Speichern und Verwalten der Daten in einer Datenbank
    - Bereitstellen einer API zur Abfrage der Daten nach verschiedenen Kriterien

2. **Datenvisualisierung**
    - Anzeige einer Weltkarte mit farbcodierten Ländern basierend auf der Anzahl der Batterieausfälle
    - Berechnung und Darstellung numerischer Indikatoren pro Land
    - Möglichkeit zur Filterung nach Batterieart und Land

3. **Benutzerinteraktion**
    - Auswahl von Ländern und Batteriearten zur Anpassung der Darstellung
    - Dynamische Anpassung der Karte basierend auf Filteroptionen

### Nicht-funktionale Anforderungen

- **Performance**: Die Anwendung sollte auch bei 20.000+ Einträgen performant bleiben.
- **Responsiveness**: Die Benutzeroberfläche soll auf verschiedenen Bildschirmgrößen gut funktionieren.
- **Erweiterbarkeit**: Möglichkeit zur späteren Integration weiterer Datenquellen oder Funktionen.

---

## Tech-Stack

### Backend
- **Python** – Hauptsprache für Datenverarbeitung und API
- **Flask** – Leichtgewichtiger Webserver für die API
- **Pandas** – Verarbeitung und Analyse der CSV-Daten
- **SQLite** oder **PostgreSQL** – Datenbank zur Speicherung der Daten
- **SQLAlchemy** – ORM für Datenbankabfragen

### Frontend
- **React** – Framework für die interaktive Benutzeroberfläche
- **Leaflet.js** – Bibliothek für interaktive Karten
- **Chakra UI** oder **Tailwind CSS** – Für eine moderne, responsive UI

### Datenvisualisierung
- **D3.js** – Datenvisualisierung (optional)
- **Leaflet Choropleth** – Darstellung der farbkodierten Länder

### Hosting & Deployment
- **Docker** – Containerisierung für einfaches Deployment
- **Vercel** oder **Netlify** – Hosting des Frontends
- **Render.com** oder **Heroku** – Hosting des Backends

### Tools & Entwicklung
- **Jupyter Notebook** – Für die Datenanalyse während der Entwicklung
- **VS Code oder PyCharm** – Entwicklungsumgebung
- **Git & GitHub** – Versionskontrolle
- **Postman** – Testen der API

---

## Roadmap

### Phase 1: Setup & Datenverarbeitung
- CSV-Datenanalyse
- Datenbankstruktur definieren
- API-Endpunkte implementieren

### Phase 2: Frontend & Visualisierung
- Grundstruktur des Frontends mit React erstellen
- Leaflet.js zur Anzeige der Weltkarte integrieren
- API-Anbindung und erste Visualisierung

### Phase 3: Optimierung & Deployment
- Performance-Optimierung der API
- UI-Feinschliff und Tests
- Deployment auf Hosting-Plattformen

---

## Entwicklungsablauf

Um das Projekt schrittweise zu implementieren, folge dieser Reihenfolge bei der Bearbeitung der Dateien:

### **1. Backend einrichten**
1. **`database.py`** – Erstelle die Verbindung zur Datenbank und definiere die Tabellenstruktur mit SQLAlchemy.
2. **`models.py`** – Definiere die Datenmodelle für die Speicherung der Batterieausfalldaten.
3. **`init_db.py`** – Implementiere die Logik zur Initialisierung der Datenbank, inkl. Import der CSV-Daten.
4. **`data_processor.py`** – Verarbeite und bereinige die Daten aus der CSV-Datei für die Speicherung.
5. **`data_routes.py`** – Entwickle API-Endpunkte zur Bereitstellung der aufbereiteten Daten.
6. **`filter_routes.py`** – Implementiere Filterlogik, um Abfragen nach Ländern und Batterietypen zu ermöglichen.
7. **`app.py`** – Setze das Flask-Backend auf, binde die Routen ein und starte den Server.

### **2. Frontend entwickeln**
1. **`apiClient.js`** – Implementiere Funktionen zum Abrufen der Daten von der API.
2. **`Map.js`** – Entwickle die interaktive Karte mit Leaflet.js zur Visualisierung der Batterieausfälle.
3. **`Filter.js`** – Erstelle eine UI-Komponente zur Auswahl von Filtern (Land, Batterietyp).
4. **`Chart.js`** – Falls nötig, entwickle eine zusätzliche Diagramm-Komponente zur Datendarstellung.
5. **`HomePage.js`** – Kombiniere die UI-Komponenten und stelle sie als Hauptansicht bereit.
6. **`App.js`** – Integriere alle Komponenten in die Hauptstruktur der React-Anwendung.

### **3. Deployment vorbereiten**
1. **`Dockerfile`** – Erstelle ein Docker-Image für das Backend.
2. **`docker-compose.yml`** – Konfiguriere das Backend und Frontend für den gemeinsamen Betrieb.
3. **Deployment-Skripte** – Falls erforderlich, erstelle Skripte für Deployment auf Vercel, Netlify oder Render.

---

## Installation & Nutzung

### Voraussetzungen
- Python 3.x
- Node.js & npm
- Docker (optional)

### Setup

1. **Backend installieren**
   ```sh
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend installieren**
   ```sh
   cd frontend
   npm install
   npm start
   ```

3. **Datenbank initialisieren**
   ```sh
   python init_db.py
   ```

Die Anwendung ist dann unter http://localhost:3000 erreichbar.

⸻

Lizenz

MIT License – Feel free to modify and distribute.
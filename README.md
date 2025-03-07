<!-- This file contains the project description, features, requirements, tech stack, roadmap, and installation instructions for the Battery Failure Visualization project. -->

# Datenvisualisierung aus CSV-Dateien

## Projektbeschreibung

Dieses Projekt bietet eine Plattform zur Visualisierung von Daten aus CSV-Dateien. Benutzer können auswählen, welche Daten sie anzeigen möchten, um Anomalien oder Ausfälle zu erkennen und relevante Einblicke zu gewinnen. Ziel ist es, die Zuverlässigkeit und Wartungsprozesse zu verbessern.

---

## Features

- **Interaktive Visualisierung** zur Darstellung beliebiger Daten aus CSV-Dateien
- **Datenfilterung** nach verschiedenen Kriterien
- **Farbcodierte Darstellung** von Daten
- **Dynamische Aktualisierung** der Ansicht basierend auf Benutzerinteraktionen
- **REST API** zur Bereitstellung der Daten

---

## Anforderungen

### Funktionale Anforderungen

1. **Datenverarbeitung**
    - Einlesen einer CSV-Datei mit beliebigen Daten
    - Speichern und Verwalten der Daten in einer Datenbank
    - Bereitstellen einer API zur Abfrage der Daten nach verschiedenen Kriterien

2. **Datenvisualisierung**
    - Anzeige von Daten in Diagrammen, Tabellen oder Warnungen
    - Berechnung und Darstellung numerischer Indikatoren
    - Möglichkeit zur Filterung nach verschiedenen Kriterien

3. **Benutzerinteraktion**
    - Auswahl von Kriterien zur Anpassung der Darstellung
    - Dynamische Anpassung der Visualisierung basierend auf Filteroptionen

### Nicht-funktionale Anforderungen

- **Performance**: Die Anwendung sollte auch bei großen Datenmengen performant bleiben.
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
- **Chakra UI** oder **Tailwind CSS** – Für eine moderne, responsive UI

### Datenvisualisierung
- **D3.js** – Datenvisualisierung (optional)
- **Chart.js** – Darstellung von Diagrammen

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
2. **`models.py`** – Definiere die Datenmodelle für die Speicherung der CSV-Daten.
3. **`init_db.py`** – Implementiere die Logik zur Initialisierung der Datenbank, inkl. Import der CSV-Daten.
4. **`data_processor.py`** – Verarbeite und bereinige die Daten aus der CSV-Datei für die Speicherung.
5. **`data_routes.py`** – Entwickle API-Endpunkte zur Bereitstellung der aufbereiteten Daten.
6. **`filter_routes.py`** – Implementiere Filterlogik, um Abfragen nach verschiedenen Kriterien zu ermöglichen.
7. **`app.py`** – Setze das Flask-Backend auf, binde die Routen ein und starte den Server.

### **2. Frontend entwickeln**
1. **`apiClient.js`** – Implementiere Funktionen zum Abrufen der Daten von der API.
2. **`DataVisualization.js`** – Entwickle die interaktive Visualisierung zur Darstellung der Daten.
3. **`Filter.js`** – Erstelle eine UI-Komponente zur Auswahl von Filtern.
4. **`HomePage.js`** – Kombiniere die UI-Komponenten und stelle sie als Hauptansicht bereit.
5. **`App.js`** – Integriere alle Komponenten in die Hauptstruktur der React-Anwendung.

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
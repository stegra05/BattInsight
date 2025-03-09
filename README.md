# Battery Failure Visualization

**Datenvisualisierung aus CSV-Dateien zur Erkennung von Anomalien und Ausfällen**

## Inhaltsverzeichnis
- [Projektbeschreibung](#projektbeschreibung)
- [Features](#features)
- [Anforderungen](#anforderungen)
  - [Funktionale Anforderungen](#funktionale-anforderungen)
  - [Nicht-funktionale Anforderungen](#nicht-funktionale-anforderungen)
- [Tech-Stack](#tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Datenvisualisierung](#datenvisualisierung)
  - [Hosting & Deployment](#hosting--deployment)
  - [Tools & Entwicklung](#tools--entwicklung)
- [Roadmap](#roadmap)
- [Entwicklungsablauf](#entwicklungsablauf)
- [Installation & Nutzung](#installation--nutzung)
- [Beitrag leisten](#beitrag-leisten)
- [Lizenz](#lizenz)

---

## Projektbeschreibung

Dieses Projekt bietet eine interaktive Plattform zur Visualisierung von Daten, die aus einer CSV-Datei importiert werden. Die CSV-Datei enthält Felder wie `battAlias`, `country`, `continent`, `climate`, `iso_a3`, `model_series`, `var`, `val`, `descr` und `cnt_vhcl`. Ziel ist es, mithilfe einer interaktiven Weltkarte (unter Verwendung von Mapbox) Länder farblich entsprechend der Intensität ausgewählter KPI-Werte (definiert durch `var` und `val`) darzustellen.

Zusätzlich wird ein AI-Feature integriert, das es dem Benutzer ermöglicht, über ein Texteingabefeld in natürlicher Sprache Abfragen zu formulieren. Mithilfe der OpenAI API wird diese Beschreibung in eine SQL-Abfrage umgewandelt, die dann die gewünschten Daten aus einer PostgreSQL-Datenbank abruft.

---

## Features

- **Interaktive Visualisierung:**  
  - Darstellung der Daten in einer übersichtlichen, interaktiven Weltkarte.
  - Farbliche Hervorhebung der Länder basierend auf KPI-Werten.
- **Datenfilterung:**  
  - Einfache Auswahlmöglichkeiten über Dropdowns und Schieberegler.
  - Filteroptionen für Kontinent, Land, Klima, Modellserie, battAlias und numerische Wertebereiche (z. B. für `val`).
- **Dynamische Aktualisierung:**  
  - Live-Updates der Karte und Tabelle basierend auf Benutzerinteraktionen.
- **REST API:**  
  - Bereitstellung von Endpunkten zur Datenabfrage und -filterung.
- **AI-gesteuerte Abfragen:**  
  - Ein Texteingabefeld, in das der Benutzer in natürlicher Sprache beschreibt, welche Daten er sehen möchte.
  - Automatische Generierung und Validierung von SQL-Abfragen über die OpenAI API.

---

## Anforderungen

### Funktionale Anforderungen
1. **Datenverarbeitung**
   - Einlesen und Verarbeiten von CSV-Dateien (Datenquelle: CSV mit Feldern wie battAlias, country, continent, etc.).
   - Speicherung und Verwaltung der Daten in einer PostgreSQL-Datenbank.
   - Bereitstellung einer REST API, um die verarbeiteten Daten abzufragen.

2. **Datenvisualisierung**
   - Darstellung der Daten zunächst in Tabellenform, später in einer interaktiven Weltkarte.
   - Berechnung und Anzeige numerischer Indikatoren.
   - Möglichkeit, Daten dynamisch zu filtern (über Dropdowns und Schieberegler).

3. **Benutzerinteraktion**
   - Auswahl von Filteroptionen über intuitive UI-Komponenten.
   - Integration eines Texteingabefeldes für AI-gesteuerte Abfragen.
   - Dynamische Anpassung der Visualisierung basierend auf den Nutzeraktionen.

### Nicht-funktionale Anforderungen
- **Performance:**  
  - Effiziente Datenverarbeitung und schnelle API-Antwortzeiten, auch bei großen Datenmengen.
- **Responsiveness:**  
  - Optimale Darstellung und Bedienbarkeit auf Desktop-Umgebungen.
- **Erweiterbarkeit:**  
  - Ein modular aufgebautes System, das leicht um weitere Datenquellen und Funktionen erweitert werden kann.
- **Sicherheit:**  
  - Validierung und sichere Verarbeitung der von der AI generierten SQL-Abfragen.

---

## Tech-Stack

### Backend
- **Python:** Hauptsprache für Datenverarbeitung und API-Entwicklung.
- **Flask:** Leichtgewichtiger Webserver für die Bereitstellung der API.
- **Pandas:** Effiziente Datenverarbeitung und Analyse.
- **PostgreSQL:** Robuste Datenbank zur Speicherung und Verwaltung der importierten CSV-Daten.
- **SQLAlchemy:** ORM zur einfachen und sicheren Interaktion mit der Datenbank.

### Frontend
- **React:** Framework zur Erstellung einer modernen und interaktiven Benutzeroberfläche.
- **Chakra UI / Tailwind CSS:** Für moderne, responsive UI-Designs.

### Datenvisualisierung
- **Mapbox GL JS:**  
  - Interaktive Darstellung der Weltkarte.
  - Farbliche Hervorhebung der Länder basierend auf KPI-Werten.
  - Hinweis: Mapbox bietet ein kostenloses Nutzungskontingent. Bei Überschreitung des Limits können Kosten anfallen, da API-Aufrufe über einen API-Key abgerechnet werden.

### AI-Integration
- **OpenAI API:**  
  - Umwandlung von natürlichen Sprachabfragen in SQL-Abfragen.
  - Validierung und Optimierung der generierten SQL-Abfragen zur sicheren Datenabfrage.

### Hosting & Deployment
- **Docker:** Containerisierung der einzelnen Projektkomponenten.
- **Docker Compose:** Orchestrierung von Backend, Frontend und PostgreSQL-Datenbank.
- **Deployment:** Möglichkeit zur einfachen Bereitstellung der gesamten Anwendung auf verschiedenen Plattformen.

### Tools & Entwicklung
- **Jupyter Notebook:** Datenanalyse und Prototyping.
- **VS Code:** Entwicklungsumgebung, unterstützt durch GitHub Copilot.
- **Git & GitHub:** Versionskontrolle und kollaborative Entwicklung.
- **Postman:** Testen der API-Endpunkte.
- **pytest:** Unit-Tests für das Backend.
- **Cypress:** End-to-End-Tests für die komplette Anwendung.

---

## Roadmap

**Phase 1: Setup & Datenverarbeitung**
- Analyse und Import der CSV-Daten in die PostgreSQL-Datenbank.
- Definition der Datenbankstruktur und Implementierung der grundlegenden API-Endpunkte.

**Phase 2: Frontend & Visualisierung**
- Erstellung einer tabellarischen Darstellung der Daten in React.
- Integration der REST API und Implementierung interaktiver Filter.
- Aufbau der interaktiven Weltkarte mit Mapbox GL JS, inklusive farblicher Darstellung der KPI-Werte.

**Phase 3: Optimierung & AI-Integration**
- Implementierung des AI-Features: Texteingabefeld und OpenAI API zur SQL-Generierung.
- Validierung und Optimierung der generierten SQL-Abfragen.
- Erweiterung der Filteroptionen und Verbesserung der Benutzerinteraktion.
- Umfassende Unit- und End-to-End-Tests mit pytest und Cypress.
- Vorbereitung des containerisierten Deployments mittels Docker und Docker Compose.

---

## Entwicklungsablauf

**Backend einrichten:**
1. **`database.py`:** Aufbau der Datenbankverbindung und Definition der Tabellenstruktur.
2. **`models.py`:** Definition der Datenmodelle für den CSV-Datensatz.
3. **`init_db.py`:** Initialisierung der PostgreSQL-Datenbank inklusive Import der CSV-Daten.
4. **`data_processor.py`:** Verarbeitung und Bereinigung der CSV-Daten.
5. **`data_routes.py`:** Implementierung der API-Endpunkte zur Datenbereitstellung.
6. **`filter_routes.py`:** Implementierung der Filterlogik zur Abfrage der Daten.
7. **`app.py`:** Starten des Flask-Backends und Einbindung der Routen.
8. **`ai_query.py`:** Integration der OpenAI API zur Generierung und Validierung von SQL-Abfragen basierend auf natürlichen Sprachbefehlen.

**Frontend entwickeln:**
1. **`apiClient.js`:** Funktionen zum Abrufen der Daten von der API.
2. **`DataVisualization.js`:** Interaktive Visualisierung der Daten – initial als Tabelle, später als Mapbox-Weltkarte.
3. **`Filter.js`:** UI-Komponente für die Filteroptionen (Dropdowns und Schieberegler).
4. **`AIQuery.js`:** Komponente für das Texteingabefeld, um AI-gesteuerte Abfragen zu ermöglichen.
5. **`HomePage.js`:** Zusammenführung der UI-Komponenten (Datenanzeige, Filter und AI-Feature).
6. **`App.js`:** Integration aller Komponenten in die Hauptanwendung.

**Deployment vorbereiten:**
1. **`Dockerfile`:** Erstellung eines Docker-Images für das Flask-Backend.
2. **`docker-compose.yml`:** Konfiguration für den gemeinsamen Betrieb von Backend, Frontend und PostgreSQL-Datenbank.
3. **Deployment-Skripte:** Optionale Skripte zur Vereinfachung der Bereitstellung auf verschiedenen Plattformen.

---

## Installation & Nutzung

### Voraussetzungen
- **Python 3.x**
- **Node.js & npm**
- **Docker** (optional, empfohlen für ein konsistentes Deployment)

### Setup

1. **Backend installieren:**
   - Navigiere in das Backend-Verzeichnis:
     ```sh
     cd backend
     ```
   - Installiere die benötigten Python-Abhängigkeiten:
     ```sh
     pip install -r requirements.txt
     ```
   - Starte das Flask-Backend:
     ```sh
     python app.py
     ```

2. **Frontend installieren:**
   - Navigiere in das Frontend-Verzeichnis:
     ```sh
     cd frontend
     ```
   - Installiere die benötigten Node.js-Abhängigkeiten:
     ```sh
     npm install
     ```
   - Starte das React-Frontend:
     ```sh
     npm start
     ```

3. **Datenbank initialisieren:**
   - Führe das Initialisierungsskript aus, um die CSV-Daten in die PostgreSQL-Datenbank zu importieren:
     ```sh
     python init_db.py
     ```

4. **Zugriff auf die Anwendung:**
   - Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## Beitrag leisten

Wir freuen uns über jede Art von Beitrag zum Projekt!  
Bitte beachte unsere [Contributing Guidelines](CONTRIBUTING.md) und eröffne einen Issue oder Pull Request, wenn du Verbesserungsvorschläge oder Erweiterungen einbringen möchtest.

---

## Lizenz

Dieses Projekt steht unter der MIT License. Weitere Informationen findest du in der [LICENSE](LICENSE).

---

**Hinweis:**  
Dieses Projekt dient als Plattform zur Visualisierung von CSV-Daten, um Anomalien und Ausfälle frühzeitig zu erkennen und Wartungsprozesse zu optimieren. Mit der Integration interaktiver Filter, einer dynamischen Weltkarte und einem AI-Feature zur SQL-Generierung möchten wir eine zukunftsweisende und benutzerfreundliche Lösung bieten. Wir freuen uns auf dein Feedback und deine Beiträge!
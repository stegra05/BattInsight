# Requirements Document

## Projektübersicht

Das Ziel dieses Projekts ist die Entwicklung einer interaktiven Plattform zur Visualisierung von CSV-Daten, um Anomalien und Ausfälle im Bereich der Batteriedaten zu erkennen. Die Daten werden aus einer CSV-Datei importiert, in einer PostgreSQL-Datenbank gespeichert und über eine REST API für das Frontend bereitgestellt. Die Visualisierung erfolgt über eine interaktive Weltkarte, bei der die Länder basierend auf ausgewählten KPI-Werten farblich hervorgehoben werden. Zusätzlich wird ein AI-Feature integriert, das natürliche Sprachabfragen in SQL-Abfragen umwandelt, um spezifische Datenabfragen zu ermöglichen.

---

## Funktionsanforderungen

### 1. Datenverarbeitung

- **CSV-Datenimport:**
  - Der Datensatz wird aus einer CSV-Datei importiert, die folgende Felder enthält: `battAlias`, `country`, `continent`, `climate`, `iso_a3`, `model_series`, `var`, `val`, `descr`, `cnt_vhcl`.
  - Die CSV-Daten werden mit Pandas eingelesen und bereinigt (z. B. Entfernung von Leerzeichen, Normalisierung von Feldnamen).
  - Der Import erfolgt initial einmalig, mit der Möglichkeit, den Import bei Bedarf manuell oder periodisch erneut auszuführen.

- **Datenbankintegration:**
  - Die bereinigten Daten werden in einer PostgreSQL-Datenbank gespeichert.
  - Es wird SQLAlchemy als ORM genutzt, um eine einfache und sichere Interaktion mit der Datenbank zu ermöglichen.
  - Eine robuste Tabellenstruktur wird definiert, die alle relevanten Felder des Datensatzes abbildet.

### 2. API und Backend

- **Backend-Technologie:**
  - Das Backend wird mit Python und Flask entwickelt.
  - Es werden REST API-Endpunkte bereitgestellt, über die die verarbeiteten Daten abgerufen und gefiltert werden können.

- **API-Endpunkte:**
  - **/api/data:** Liefert die vollständigen Datensätze, optional mit Filterparametern (z. B. Kontinent, Klima, Modellserie).
  - **/api/filter:** Ermöglicht die dynamische Filterung der Daten anhand vordefinierter Kriterien.
  - **/api/ai-query:** Nimmt natürliche Sprachabfragen entgegen, wandelt diese über die OpenAI API in SQL-Abfragen um, validiert die Abfragen und liefert die entsprechenden Daten zurück.

### 3. AI-Integration

- **Natürliche Sprachverarbeitung:**
  - Ein Texteingabefeld ermöglicht es Benutzern, in natürlicher Sprache ihre Datenanfragen zu formulieren (z. B. "Zeige alle Daten für Europa mit gemäßigtem Klima").
  - Die Anfrage wird an den `/api/ai-query` Endpunkt gesendet.

- **OpenAI API:**
  - Die OpenAI API wird genutzt, um aus der natürlichen Sprache eine SQL-Abfrage zu generieren.
  - Die generierten SQL-Abfragen werden validiert und optimiert, um sicherzustellen, dass sie korrekt und sicher sind, bevor sie an die Datenbank gesendet werden.
  - Sicherheitsaspekte: Es wird geprüft, dass die SQL-Abfragen gegen SQL-Injection und andere Risiken abgesichert sind.

### 4. Frontend

- **Technologie:**
  - Das Frontend wird mit React entwickelt.
  - Moderne UI-Designs werden mithilfe von Frameworks wie Chakra UI oder Tailwind CSS umgesetzt.

- **Datenvisualisierung:**
  - **Tabellarische Darstellung:** Initial wird eine Tabelle verwendet, um die importierten Daten anzuzeigen.
  - **Interaktive Weltkarte:** Mit Mapbox GL JS wird eine interaktive Weltkarte integriert, bei der Länder basierend auf den KPI-Werten farblich hervorgehoben werden.
    - Hinweis: Mapbox bietet ein kostenloses Nutzungskontingent, jedoch können bei Überschreitung des Limits Kosten anfallen, da API-Aufrufe über einen API-Schlüssel abgerechnet werden.

- **Interaktive Filter:**
  - **Dropdown-Menüs:** Für vordefinierte Filterkriterien wie Kontinent, Land, Klima, Modellserie und battAlias.
  - **Schieberegler:** Für numerische Filter, insbesondere zur Festlegung von Wertebereichen für `val`.
  - **Kombinierte Filter:** Eine Kombination aus Dropdowns und Schiebereglern, um eine intuitive und flexible Benutzerführung zu gewährleisten.

- **AI-Feature im Frontend:**
  - Ein Texteingabefeld ermöglicht es Benutzern, natürliche Sprachabfragen einzugeben.
  - Diese Abfragen werden an den entsprechenden API-Endpunkt weitergeleitet, und die Ergebnisse werden in der Anwendung angezeigt.

### 5. Filteranforderungen

Die folgenden Filteroptionen sollen implementiert werden:

- **Kontinent:** Auswahlmöglichkeiten (z. B. Europa, Asien, Afrika, Nordamerika, Südamerika, Ozeanien, Antarktis).
- **Land:** Auswahl basierend auf `country` oder `iso_a3`.
- **Klima:** Filterung nach Klimatypen (z. B. tropisch, gemäßigt, arid, polar).
- **Modellserie:** Auswahl basierend auf `model_series`.
- **battAlias:** Auswahl spezifischer Aliasnamen.
- **Variablenfilter:** Auswahl bestimmter `var`-Werte, kombiniert mit einem numerischen Filter für `val`.
- **Zusätzliche Filter:** Optionaler Filter für `descr` (Stichwortsuche) und `cnt_vhcl` (Fahrzeuganzahl), sofern relevant.

---

## Nicht-funktionale Anforderungen

- **Performance:**
  - Schnelle Verarbeitung der CSV-Daten und schnelle API-Antwortzeiten, auch bei großen Datenmengen.

- **Responsiveness:**
  - Optimale Darstellung und Bedienbarkeit der Webanwendung auf Desktop-Umgebungen.

- **Erweiterbarkeit:**
  - Ein modular aufgebautes System, das die einfache Integration weiterer Datenquellen und Features ermöglicht.

- **Sicherheit:**
  - Validierung der durch die AI generierten SQL-Abfragen zur Vermeidung von SQL-Injection und anderen Sicherheitsrisiken.
  - Sicherer Umgang mit Benutzeranfragen und API-Endpunkten.

- **Wartbarkeit:**
  - Gut strukturierter Code mit umfangreichen Unit-Tests (pytest für das Backend, Cypress für End-to-End-Tests).
  - Detaillierte Dokumentation der API-Endpunkte und internen Funktionen zur einfachen Erweiterung und Fehlersuche.

---

## Infrastruktur & Deployment

- **Containerisierung:**
  - Einsatz von Docker zur Containerisierung der einzelnen Komponenten (Backend, Frontend, Datenbank).
  - Nutzung von Docker Compose zur Orchestrierung von Flask-Backend, React-Frontend und PostgreSQL-Datenbank.

- **Deployment:**
  - Bereitstellung der Anwendung in einem konsistenten, containerisierten Umfeld, das eine einfache Skalierung und Bereitstellung auf verschiedenen Plattformen ermöglicht.

---

## Testing & Entwicklungsprozess

- **Unit Testing:**
  - Einsatz von pytest zur Absicherung der API-Endpunkte und Kernfunktionen im Backend.

- **End-to-End Testing:**
  - Nutzung von Cypress für End-to-End-Tests, um den kompletten Workflow der Anwendung zu validieren (vom CSV-Import über die API bis zur Visualisierung).

- **Entwicklungsumgebung:**
  - Verwendung von VS Code mit GitHub Copilot, um schnelle Prototypen und effiziente Entwicklung zu unterstützen.
  - Einrichtung einer kontinuierlichen Integration (CI) in zukünftigen Erweiterungen, um automatisierte Tests und Deployments zu ermöglichen.

---

## Zusammenfassung

Dieses Requirements Document definiert detailliert die Anforderungen und den Implementierungsansatz für das Projekt "Battery Failure Visualization". Es beschreibt die Verarbeitung und Speicherung der CSV-Daten, die Bereitstellung einer REST API, die Integration eines AI-Features zur SQL-Generierung sowie die Entwicklung eines interaktiven Frontends mit Mapbox GL JS und umfassenden Filteroptionen. Alle Komponenten werden containerisiert bereitgestellt, um eine skalierbare und konsistente Deployment-Lösung zu gewährleisten. Unit- und End-to-End-Tests sichern die Funktionalität und Stabilität der Anwendung.

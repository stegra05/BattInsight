# Datenvisualisierungsanwendung - Installationsanleitung

Diese Anleitung führt Sie durch die Installation und Einrichtung der Datenvisualisierungsanwendung.

## Voraussetzungen

- Docker und Docker Compose müssen installiert sein
- Die Datendatei `world_kpi_anonym.txt` muss verfügbar sein

## Schnellstart

1. Entpacken Sie die ZIP-Datei in ein Verzeichnis Ihrer Wahl
2. Öffnen Sie ein Terminal im entpackten Verzeichnis
3. Führen Sie das Setup-Skript aus:

```bash
./setup.sh
```

Das Skript überprüft alle Voraussetzungen, kopiert die Datendatei (falls nötig) und startet die Anwendung.

## Manuelle Installation

Falls Sie die Anwendung manuell einrichten möchten:

1. Stellen Sie sicher, dass Docker und Docker Compose installiert sind
2. Erstellen Sie ein Verzeichnis `upload` und kopieren Sie die Datei `world_kpi_anonym.txt` hinein
3. Führen Sie den folgenden Befehl aus:

```bash
docker-compose up -d
```

4. Öffnen Sie einen Browser und navigieren Sie zu `http://localhost:3000`

## Anwendung beenden

Um die Anwendung zu beenden, führen Sie folgenden Befehl aus:

```bash
docker-compose down
```

## Fehlerbehebung

- **Problem**: Die Anwendung startet nicht
  **Lösung**: Überprüfen Sie, ob Docker und Docker Compose installiert sind und ob die Ports 3000 nicht bereits belegt ist

- **Problem**: Keine Daten werden angezeigt
  **Lösung**: Stellen Sie sicher, dass die Datei `world_kpi_anonym.txt` im Verzeichnis `upload` liegt

- **Problem**: Docker-Fehler beim Start
  **Lösung**: Führen Sie `docker-compose down` aus und versuchen Sie dann erneut `docker-compose up -d`

## Weitere Informationen

Detaillierte Informationen zur Anwendung finden Sie in der README.md-Datei.

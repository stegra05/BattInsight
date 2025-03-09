# Zweck: Docker-Image für das Backend.
# Funktionen:
#    • Installiert Abhängigkeiten (pip install -r requirements.txt).
#    • Startet app.py.
# Abhängigkeiten:
#    • Flask, SQLAlchemy, pandas.

FROM python:3.9-slim

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Datei requirements.txt in das Arbeitsverzeichnis
COPY requirements.txt .

# Installiere die Python-Abhängigkeiten
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere den gesamten Quellcode in das Arbeitsverzeichnis
COPY . .

# Exponiere den Port, den die Flask-App verwendet (Standard: 5000)
EXPOSE 5000

# Starte die Anwendung
CMD ["python", "app.py"]
"""
Zweck: Initialisiert die Datenbankverbindung mit SQLAlchemy.
Funktionen:
	•	Erstellt eine Verbindung zur SQLite/PostgreSQL-Datenbank.
	•	Führt Migrationen aus (falls benötigt).
	•	Stellt eine Session zur Verfügung.
Abhängigkeiten:
	•	config.py für Datenbankverbindungs-String.
	•	models.py für die Tabellenstrukturen.
"""
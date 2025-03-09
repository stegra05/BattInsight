"""
Ziel & Funktion:
	•	Implementiert das AI-Feature: Nimmt natürliche Sprachabfragen entgegen und wandelt sie mithilfe der OpenAI API in SQL-Abfragen um.
	•	Führt eine Validierung und Optimierung der generierten SQL-Abfragen durch, bevor diese an die Datenbank übergeben werden.
Abhängigkeiten:
	•	Greift auf database.py zur Ausführung von Abfragen zu und auf Umgebungsvariablen (z. B. OpenAI API-Key) aus der .env zu.
"""
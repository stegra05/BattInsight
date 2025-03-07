"""
Zweck: Initialisiert die Datenbankverbindung mit SQLAlchemy.

Funktionen:
  • Erstellt eine Verbindung zur SQLite/PostgreSQL-Datenbank.
  • Führt Migrationen aus (falls benötigt).
  • Stellt eine Session zur Verfügung.

Abhängigkeiten:
  • config.py für den Datenbankverbindungs-String.
  • models.py für die Tabellenstrukturen.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
import os

# Define Base before using it
Base = declarative_base()

from .models import BatteryFailure

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'battery_failures.db')}"

# Erstellen der Engine. Der Verbindungs-String wird aus config.py geladen.
engine = create_engine(DATABASE_URL, echo=True)

# Migrationen ausführen: Erstellen aller Tabellen, falls sie noch nicht existieren.
Base.metadata.create_all(bind=engine)

# Konfigurieren des Session Makers
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def get_session():
    """Stellt eine SQLAlchemy-Session als Kontextmanager zur Verfügung."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# Optional: Falls du eine einfache Funktion bevorzugst, die direkt eine Session zurückgibt, kannst du folgenden Code verwenden:
# def get_session_direct():
#     """Gibt eine neue SQLAlchemy-Session zurück. Der Aufrufer ist verantwortlich für das Schließen der Session."""
#     return SessionLocal()

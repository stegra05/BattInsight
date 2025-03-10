"""Ziel & Funktion:
	•	Definiert die SQLAlchemy-Datenmodelle, die die Tabellenstruktur in der Datenbank abbilden (z. B. Felder wie battAlias, country, etc.).
Abhängigkeiten:
	•	Nutzt die Verbindung und Konfiguration aus database.py und wird von Modulen wie init_db.py und data_processor.py für das Erstellen bzw. Befüllen der Tabellen verwendet.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class BatteryData(Base):
    """SQLAlchemy model for battery data.
    
    This model represents the battery data imported from CSV files and contains
    fields like batt_alias, country, continent, climate, etc.
    """
    __tablename__ = 'battery_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    batt_alias = Column(String, nullable=False, index=True)
    country = Column(String, nullable=True, index=True)
    continent = Column(String, nullable=True, index=True)
    climate = Column(String, nullable=True, index=True)
    iso_a3 = Column(String(3), nullable=True, index=True)
    model_series = Column(Integer, nullable=True, index=True)
    var = Column(String, nullable=False, index=True)
    val = Column(Float, nullable=False)
    descr = Column(String, nullable=True)
    cnt_vhcl = Column(Integer, nullable=True)
    
    def __repr__(self):
        """Return a string representation of the BatteryData instance."""
        return f"<BatteryData(id={self.id}, batt_alias='{self.batt_alias}', var='{self.var}', val={self.val})>"
"""
Zweck: Definiert die Datenbanktabellen mit SQLAlchemy.
Funktionen:
	•	Erstellt ORM-Modelle für Batterieausfälle mit Spalten wie id, country, battery_type, failure_rate.
	•	Erstellt ein Modell für Welt-KPIs basierend auf der CSV Datei 'world_kpi_anonym.csv'.
Abhängigkeiten:
	•	database.py für die Session.
	•	Wird von data_processor.py und data_routes.py genutzt.
"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float

Base = declarative_base()

class BatteryFailure(Base):
    __tablename__ = 'battery_failures'

    id = Column(Integer, primary_key=True, index=True)
    battAlias = Column(String)  # Changed from battery_alias
    country = Column(String)
    continent = Column(String, nullable=True)
    climate = Column(String, nullable=True)
    iso_a3 = Column(String, nullable=True)
    model_series = Column(String)
    var = Column(String)
    val = Column(Float)
    descr = Column(String)
    cnt_vhcl = Column(Integer)

    def __repr__(self):
        return f"<BatteryFailure(id={self.id}, country='{self.country}', model_series={self.model_series}, var='{self.var}', val={self.val})>"

# Weitere Modelle können hier bei Bedarf ergänzt werden.

# Neues Modell basierend auf der CSV Datei 'world_kpi_anonym.csv'
# Die CSV enthält folgende Spalten:
# battAlias;country;continent;climate;iso_a3;model_series;var;val;descr;cnt_vhcl
class WorldKPI(Base):
    __tablename__ = 'world_kpis'

    id = Column(Integer, primary_key=True, index=True)
    batt_alias = Column(String, index=True)  # entspricht battAlias
    country = Column(String, index=True)
    continent = Column(String, index=True)
    climate = Column(String)
    iso_a3 = Column(String, index=True)
    model_series = Column(Integer)
    var = Column(String)
    val = Column(Integer)
    descr = Column(String)
    cnt_vhcl = Column(Integer)

    def __repr__(self):
        return (f"<WorldKPI(id={self.id}, batt_alias='{self.batt_alias}', country='{self.country}', "
                f"continent='{self.continent}', climate='{self.climate}', iso_a3='{self.iso_a3}', "
                f"model_series={self.model_series}, var='{self.var}', val={self.val}, "
                f"descr='{self.descr}', cnt_vhcl={self.cnt_vhcl})>")

def get_all_countries():
    # Dummy implementation; replace with actual query logic if needed.
    return ["Country1", "Country2", "Country3"]

def get_all_battery_types():
    # Dummy implementation; replace with actual query logic if needed.
    return ["TypeA", "TypeB"]

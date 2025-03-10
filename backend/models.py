"""Ziel & Funktion:
	•	Definiert die SQLAlchemy-Datenmodelle, die die Tabellenstruktur in der Datenbank abbilden (z. B. Felder wie battAlias, country, etc.).
Abhängigkeiten:
	•	Nutzt die Verbindung und Konfiguration aus database.py und wird von Modulen wie init_db.py und data_processor.py für das Erstellen bzw. Befüllen der Tabellen verwendet.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Index, CheckConstraint, Text, DateTime, func
from sqlalchemy.orm import relationship, validates
from .database import Base
from datetime import datetime

class ModelSeries(Base):
    """SQLAlchemy model for model series data.
    
    This model represents the different model series of batteries and contains
    fields like series_name and release_year.
    """
    __tablename__ = 'model_series'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    series_name = Column(String(50), unique=True, nullable=False)
    release_year = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    
    # Relationship with BatteryData
    batteries = relationship("BatteryData", back_populates="model")
    
    # Add versioning and timestamps
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
    
    def __repr__(self):
        """Return a string representation of the ModelSeries instance."""
        return f"<ModelSeries(id={self.id}, series_name='{self.series_name}', release_year={self.release_year})>"

class BatteryData(Base):
    """SQLAlchemy model for battery data.
    
    This model represents the battery data imported from CSV files and contains
    fields like batt_alias, country, continent, climate, etc.
    """
    __tablename__ = 'battery_data'
    __table_args__ = (
        Index('idx_val_range', 'var', 'val'),
        Index('idx_location', 'country', 'continent', 'climate'),
        CheckConstraint('val >= 0 AND val <= 1000', name='chk_val_range'),
        CheckConstraint('cnt_vhcl > 0', name='chk_cnt_vhcl_positive')
    )
    
    # Primary key and basic fields
    id = Column(Integer, primary_key=True, autoincrement=True)
    batt_alias = Column(String(50), nullable=False, index=True, comment="Unique battery identifier")
    country = Column(String(100), nullable=True, index=True)
    continent = Column(String(50), nullable=True, index=True)
    climate = Column(String(50), nullable=True, index=True)
    iso_a3 = Column(String(3), nullable=True, index=True)
    
    # Foreign key relationship for model_series
    model_series_id = Column(Integer, ForeignKey('model_series.id'), index=True)
    model = relationship("ModelSeries", back_populates="batteries")
    
    # Keep the original model_series column for backward compatibility
    model_series = Column(Integer, nullable=True, index=True)
    
    # Data fields
    var = Column(String(50), nullable=False, index=True)
    val = Column(Float, nullable=False)
    descr = Column(String(200), nullable=True)
    cnt_vhcl = Column(Integer, nullable=True)
    
    # Add versioning and timestamps
    version = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
    
    # Validation methods
    @validates('iso_a3')
    def validate_iso_a3(self, key, value):
        """Validate ISO A3 code."""
        if value is not None:
            if len(value) != 3:
                raise ValueError("ISO A3 code must be 3 characters")
            return value.upper()
        return value
    
    @validates('val')
    def validate_val(self, key, value):
        """Validate value range."""
        if value < 0 or value > 1000:
            raise ValueError("Value must be between 0 and 1000")
        return value
    
    @validates('cnt_vhcl')
    def validate_cnt_vhcl(self, key, value):
        """Validate vehicle count."""
        if value is not None and value <= 0:
            raise ValueError("Vehicle count must be positive")
        return value
    
    def __repr__(self):
        """Return a string representation of the BatteryData instance."""
        return f"<BatteryData(id={self.id}, batt_alias='{self.batt_alias}', var='{self.var}', val={self.val})>"
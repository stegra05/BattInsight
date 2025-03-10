"""
Database models for BattInsight application.
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from backend.core.database import Base

class ModelSeries(Base):
    """Model series information."""
    __tablename__ = 'model_series'
    
    id = Column(Integer, primary_key=True)
    series_name = Column(String(100), nullable=False)
    release_year = Column(Integer)
    description = Column(String(500))
    
    # Versioning and timestamps
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    batteries = relationship("BatteryData", back_populates="model")
    
    def __repr__(self):
        return f"<ModelSeries(id={self.id}, name='{self.series_name}', year={self.release_year})>"

class BatteryData(Base):
    """Battery data information."""
    __tablename__ = 'battery_data'
    
    id = Column(Integer, primary_key=True)
    batt_alias = Column(String(100), nullable=False)
    country = Column(String(100))
    continent = Column(String(100))
    climate = Column(String(100))
    iso_a3 = Column(String(3))
    model_series = Column(Integer, ForeignKey('model_series.id'))
    var = Column(String(100))
    val = Column(Float)
    descr = Column(String(500))
    cnt_vhcl = Column(Integer)
    
    # Versioning and timestamps
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    model = relationship("ModelSeries", back_populates="batteries")
    
    def __repr__(self):
        return f"<BatteryData(id={self.id}, alias='{self.batt_alias}', country='{self.country}')>"
    
    def validate_iso_a3(self):
        """Validate ISO A3 country code."""
        if self.iso_a3 and len(self.iso_a3) != 3:
            raise ValueError("ISO A3 code must be 3 characters")
        return True
    
    def validate_val(self):
        """Validate numerical value."""
        if self.val is not None and (self.val < 0 or self.val > 1000000):
            raise ValueError("Value must be between 0 and 1,000,000")
        return True
    
    def validate_cnt_vhcl(self):
        """Validate vehicle count."""
        if self.cnt_vhcl is not None and self.cnt_vhcl < 0:
            raise ValueError("Vehicle count cannot be negative")
        return True

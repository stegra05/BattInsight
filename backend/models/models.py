from sqlalchemy import create_engine, Column, String, Integer, Float, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = create_engine('sqlite:///database.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class BatteryFailure(Base):
    __tablename__ = 'battery_failures'
    id = Column(Integer, primary_key=True, index=True)
    country = Column(String, index=True)
    battery_type = Column(String, index=True)
    climate = Column(String, index=True)
    model_series = Column(String, index=True)
    val = Column(Float)
    cnt_vhcl = Column(Integer)

    def serialize(self):
        return {
            'id': self.id,
            'country': self.country,
            'battery_type': self.battery_type,
            'climate': self.climate,
            'model_series': self.model_series,
            'val': self.val,
            'cnt_vhcl': self.cnt_vhcl
        }

def get_all_countries():
    session = SessionLocal()
    try:
        countries = session.query(BatteryFailure.country).distinct().all()
        return [country[0] for country in countries]
    finally:
        session.close()

def get_all_battery_types():
    session = SessionLocal()
    try:
        battery_types = session.query(BatteryFailure.battery_type).distinct().all()
        return [battery_type[0] for battery_type in battery_types]
    finally:
        session.close()

def get_all_manufacturers():
    # Assuming there is a manufacturers table or similar logic
    pass

def get_battery_performance_by_country(battAlias, var):
    session = SessionLocal()
    try:
        query = session.query(BatteryFailure.country, func.avg(BatteryFailure.val).label('average_val'))
        if battAlias:
            query = query.filter(BatteryFailure.battery_type == battAlias)
        if var:
            query = query.filter(BatteryFailure.var == var)
        query = query.group_by(BatteryFailure.country)
        return query.all()
    finally:
        session.close()

def get_battery_performance_by_climate(battAlias):
    session = SessionLocal()
    try:
        query = session.query(BatteryFailure.climate, func.avg(BatteryFailure.val).label('average_val'))
        if battAlias:
            query = query.filter(BatteryFailure.battery_type == battAlias)
        query = query.group_by(BatteryFailure.climate)
        return query.all()
    finally:
        session.close()

def get_model_series_distribution():
    session = SessionLocal()
    try:
        query = session.query(BatteryFailure.country, BatteryFailure.model_series, func.count(BatteryFailure.id).label('cnt_vhcl'))
        query = query.group_by(BatteryFailure.country, BatteryFailure.model_series)
        return query.all()
    finally:
        session.close()

def get_vehicle_count():
    session = SessionLocal()
    try:
        query = session.query(BatteryFailure.country, BatteryFailure.battery_type, func.count(BatteryFailure.id).label('cnt_vhcl'))
        query = query.group_by(BatteryFailure.country, BatteryFailure.battery_type)
        return query.all()
    finally:
        session.close()

def get_continent_summary():
    session = SessionLocal()
    try:
        query = session.query(BatteryFailure.continent, func.avg(BatteryFailure.val).label('average_val'), func.sum(BatteryFailure.cnt_vhcl).label('total_vhcl'))
        query = query.group_by(BatteryFailure.continent)
        return query.all()
    finally:
        session.close()

def get_outliers():
    session = SessionLocal()
    try:
        global_avg = session.query(func.avg(BatteryFailure.val)).scalar()
        global_stddev = session.query(func.stddev(BatteryFailure.val)).scalar()
        threshold = global_avg + 2 * global_stddev
        query = session.query(BatteryFailure.country, func.avg(BatteryFailure.val).label('average_val'))
        query = query.group_by(BatteryFailure.country)
        query = query.having(func.avg(BatteryFailure.val) > threshold)
        return query.all()
    finally:
        session.close()
